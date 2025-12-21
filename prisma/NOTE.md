# NOTE: Prisma Extension Errors

You may see errors in the individual `.prisma` files (user.prisma, organization.prisma, etc.) in VS Code. **This is expected and can be ignored!**

## Why?

The Prisma VS Code extension validates all `.prisma` files simultaneously, but our setup only uses the merged `schema.prisma` file. The individual files are source files for organization purposes.

## What matters?

✅ **Only `schema.prisma` should have no errors after running `npm run schema:merge`**

The individual module files will show duplicate model/enum errors because VS Code sees them all together. This doesn't affect functionality.

## How to verify everything is working?

Run these commands - if they succeed, your setup is correct:

```bash
npm run schema:merge    # Should succeed
npm run prisma:format   # Should succeed
npm run prisma:generate # Should succeed
```

## Optional: Reduce VS Code errors

If the red squiggly lines bother you, you can:

1. **Option 1**: Only open `schema.prisma` in VS Code when working with Prisma
2. **Option 2**: Disable Prisma extension for individual files (keep it enabled for `schema.prisma`)
3. **Option 3**: Ignore the errors - they don't affect functionality

The production schema (`schema.prisma`) is what Prisma actually uses, and it will be error-free after merging.
