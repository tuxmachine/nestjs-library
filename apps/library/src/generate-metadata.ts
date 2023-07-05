import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
// @Kamil Readonly visitor not exposed by package root, intentional?
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

// @Kamil PluginMetadataGenerator requires TS5+, otherwise the ReadonlyVisitor type is incompatible
// @nestjs/cli uses its own typescript, whereas swagger uses the host
// Might be worth mentioning in docs?
const generator = new PluginMetadataGenerator();
generator.generate({
  visitors: [
    new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname }) as any,
  ],
  outputDir: __dirname,
  watch: Boolean(process.env.WATCH),
  // @Kamil I'm using app-specific tsconfig here to avoid including files from
  // other apps. The iterator would generate Swagger metadata for
  // controllers/dtos of internal microservices that might not even expose HTTP
  // endpoint. Should we add a tip to the docs?
  // It might be related to my bug, but using the root tsconfig gives the same error.
  tsconfigPath: 'apps/library/tsconfig.json',
});
