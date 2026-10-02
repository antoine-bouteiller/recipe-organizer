// Keep bindings in sync with void.config.ts; secrets come from env.ts.
declare namespace Cloudflare {
  interface Env extends VoidGeneratedEnvBindings {
    IMAGES: ImagesBinding
    R2_BUCKET: R2Bucket
  }
}
