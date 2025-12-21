/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * QueryBuilder class for Prisma
 * Builds complex queries with pagination, filtering, sorting, and field selection
 */
class QueryBuilder<T> {
  public query: Record<string, unknown>;
  public whereConditions: any = {};
  public selectFields: any = undefined;
  public sortOptions: any = { createdAt: 'desc' };
  public paginationOptions: { skip: number; take: number };

  constructor(query: Record<string, unknown>) {
    this.query = query;
    this.paginationOptions = {
      skip: 0,
      take: 10,
    };
  }

  /**
   * Add search functionality across multiple fields
   * @param searchableFields - Array of field names to search in
   */
  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;
    if (searchTerm && searchableFields.length > 0) {
      this.whereConditions.OR = searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      }));
    }
    return this;
  }

  /**
   * Add filtering based on query parameters
   */
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields', 'batchId', 'departmentId', 'semester', 'isActive', 'status'];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Add remaining query params as filter conditions
    Object.keys(queryObj).forEach((key) => {
      this.whereConditions[key] = queryObj[key];
    });

    return this;
  }

  /**
   * Add sorting functionality
   */
  sort() {
    if (this.query.sort) {
      const sortFields = (this.query.sort as string).split(',');
      this.sortOptions = {};

      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          this.sortOptions[field.substring(1)] = 'desc';
        } else {
          this.sortOptions[field] = 'asc';
        }
      });
    }
    return this;
  }

  /**
   * Add pagination functionality
   */
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.paginationOptions = {
      skip,
      take: limit,
    };

    return this;
  }

  /**
   * Select specific fields
   */
  fields() {
    if (this.query.fields) {
      const fields = (this.query.fields as string).split(',');
      this.selectFields = {};

      fields.forEach((field) => {
        if (!field.startsWith('-')) {
          this.selectFields[field.trim()] = true;
        }
      });
    }
    return this;
  }

  /**
   * Get the Prisma query options object
   */
  getQueryOptions() {
    return {
      where: Object.keys(this.whereConditions).length > 0 ? this.whereConditions : undefined,
      orderBy: this.sortOptions,
      skip: this.paginationOptions.skip,
      take: this.paginationOptions.take,
      select: this.selectFields,
    };
  }

  /**
   * Calculate pagination metadata
   * @param total - Total count of records
   */
  getPaginationMeta(total: number) {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
