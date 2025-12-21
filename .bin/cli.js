#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const [, , command, ...args] = process.argv;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

if (command === 'resource') {
  const resourceNameRaw = args[0];
  if (!resourceNameRaw) {
    console.error('❌ Please provide a resource name');
    process.exit(1);
  }

  const resourceName = toCamelCase(resourceNameRaw.toLowerCase());
  const capitalizedResourceName = capitalize(resourceName);

  const moduleDir = path.join(__dirname, '..', 'src', 'app', 'modules', resourceName);
  if (!fs.existsSync(moduleDir)) fs.mkdirSync(moduleDir, { recursive: true });

  const formatPath = (filePath) => path.relative(path.join(__dirname, '..'), filePath);

  // ---------- ROUTE ----------
  const routeContent = `
import { Router } from "express";
import { ${resourceName}Controllers } from "./${resourceName}.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ${resourceName}Validation } from "./${resourceName}.validation";

const router = Router();

/** Create a new ${capitalizedResourceName} */
router.post(
  "/create-${resourceName}",
  validateRequest(${resourceName}Validation.create${capitalizedResourceName}Schema),
  ${resourceName}Controllers.create${capitalizedResourceName}
);

/** Get a single ${capitalizedResourceName} by ID */
router.get(
  "/:id",
  ${resourceName}Controllers.getSingle${capitalizedResourceName}
);

/** Get all ${capitalizedResourceName}s */
router.get(
  "/",
  ${resourceName}Controllers.getAll${capitalizedResourceName}
);

export const ${resourceName}Routes = router;
`.trim();

  // ---------- CONTROLLER ----------
  const controllerContent = `
import { ${resourceName}Services } from "./${resourceName}.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

/** Create a new ${capitalizedResourceName} */
const create${capitalizedResourceName} = catchAsync(async (req, res) => {
  const result = await ${resourceName}Services.create${capitalizedResourceName}(req.body);
  sendResponse(res, { message: "New ${capitalizedResourceName} created successfully", data: result });
});

/** Get a single ${capitalizedResourceName} by ID */
const getSingle${capitalizedResourceName} = catchAsync(async (req, res) => {
  const result = await ${resourceName}Services.get${capitalizedResourceName}ById(req.params.id);
  sendResponse(res, { message: "${capitalizedResourceName} retrieved successfully", data: result });
});

/** Get all ${capitalizedResourceName}s */
const getAll${capitalizedResourceName} = catchAsync(async (req, res) => {
  const result = await ${resourceName}Services.getAll${capitalizedResourceName}(req.query);
  sendResponse(res, { message: "${capitalizedResourceName}s retrieved successfully", data: result });
});

export const ${resourceName}Controllers = {
  create${capitalizedResourceName},
  getSingle${capitalizedResourceName},
  getAll${capitalizedResourceName},
};
`.trim();

  // ---------- MODEL ----------
  const modelContent = `
import prisma from "../../config/prisma";

/**
 * ${capitalizedResourceName} model using Prisma Client
 * All database operations go through the Prisma client
 */
export const ${capitalizedResourceName}Model = prisma.${resourceName};

export default ${capitalizedResourceName}Model;
`.trim();

  // ---------- INTERFACE ----------
  const interfaceContent = `
import { ${capitalizedResourceName} } from "@prisma/client";

// Export the Prisma-generated ${capitalizedResourceName} type
export type I${capitalizedResourceName} = ${capitalizedResourceName};

// For creating a new ${resourceName} (without id and timestamps)
export type I${capitalizedResourceName}Create = Omit<${capitalizedResourceName}, "id" | "createdAt" | "updatedAt">;

// For updating a ${resourceName} (all fields optional)
export type I${capitalizedResourceName}Update = Partial<I${capitalizedResourceName}Create>;
`.trim();

  // ---------- VALIDATION ----------
  const validationContent = `
import { z } from "zod";

/** Validation schema for creating ${capitalizedResourceName} */
const create${capitalizedResourceName}Schema = z.object({
  body: z.object({
    // Add validation rules here
    // Example: name: z.string().min(1, "Name is required"),
  }),
});

/** Validation schema for updating ${capitalizedResourceName} */
const update${capitalizedResourceName}Schema = z.object({
  body: z.object({
    // Add validation rules here (all optional for updates)
  }),
});

export const ${resourceName}Validation = {
  create${capitalizedResourceName}Schema,
  update${capitalizedResourceName}Schema,
};
`.trim();

  // ---------- SERVICE ----------
  const serviceContent = `
import { ${capitalizedResourceName}Model } from "./${resourceName}.model";
import { I${capitalizedResourceName}Create } from "./${resourceName}.interface";
import QueryBuilder from "../../builder/QueryBuilder";

/** Create a new ${capitalizedResourceName} */
const create${capitalizedResourceName} = async (data: I${capitalizedResourceName}Create) => {
  return await ${capitalizedResourceName}Model.create({ data });
};

/** Get a ${capitalizedResourceName} by ID */
const get${capitalizedResourceName}ById = async (id: string) => {
  return await ${capitalizedResourceName}Model.findUnique({
    where: { id },
  });
};

/** Get all ${capitalizedResourceName}s with query builder support */
const getAll${capitalizedResourceName} = async (query: any) => {
  const queryBuilder = new QueryBuilder(query);
  
  // Build query with search, filter, sort, pagination, and field selection
  // Add searchable fields: queryBuilder.search(['name', 'description'])
  queryBuilder.filter().sort().paginate().fields();
  
  const queryOptions = queryBuilder.getQueryOptions();
  
  // Execute query
  const [items, total] = await Promise.all([
    ${capitalizedResourceName}Model.findMany(queryOptions),
    ${capitalizedResourceName}Model.count({ where: queryOptions.where }),
  ]);
  
  const meta = queryBuilder.getPaginationMeta(total);
  
  return {
    data: items,
    meta,
  };
};

/** Update a ${capitalizedResourceName} by ID */
const update${capitalizedResourceName} = async (id: string, data: Partial<I${capitalizedResourceName}Create>) => {
  return await ${capitalizedResourceName}Model.update({
    where: { id },
    data,
  });
};

/** Delete a ${capitalizedResourceName} by ID */
const delete${capitalizedResourceName} = async (id: string) => {
  return await ${capitalizedResourceName}Model.delete({
    where: { id },
  });
};

export const ${resourceName}Services = {
  create${capitalizedResourceName},
  get${capitalizedResourceName}ById,
  getAll${capitalizedResourceName},
  update${capitalizedResourceName},
  delete${capitalizedResourceName},
};
`.trim();

  // ---------- FILES ----------
  const files = {
    [path.join(moduleDir, `${resourceName}.route.ts`)]: routeContent,
    [path.join(moduleDir, `${resourceName}.controller.ts`)]: controllerContent,
    [path.join(moduleDir, `${resourceName}.model.ts`)]: modelContent,
    [path.join(moduleDir, `${resourceName}.interface.ts`)]: interfaceContent,
    [path.join(moduleDir, `${resourceName}.validation.ts`)]: validationContent,
    [path.join(moduleDir, `${resourceName}.service.ts`)]: serviceContent,
  };

  console.log(`\n${GREEN}✓${RESET} Creating ${capitalizedResourceName} module with Prisma...\n`);

  for (const [filePath, content] of Object.entries(files)) {
    fs.writeFileSync(filePath, content);
    console.log(
      `${GREEN}CREATE ${RESET}${formatPath(filePath)} ${BLUE}(${Buffer.byteLength(
        content,
        'utf8'
      )} bytes)${RESET}`
    );
  }

  console.log(`\n${YELLOW}⚠ Don't forget to:${RESET}`);
  console.log(`  1. Add the ${capitalizedResourceName} model to prisma/schema.prisma`);
  console.log(`  2. Run: npx prisma migrate dev --name add-${resourceName}`);
  console.log(`  3. Add the route to src/app/routes/index.ts\n`);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
