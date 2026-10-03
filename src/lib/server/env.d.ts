// Keep bindings in sync with void.config.ts and void.lock.json; secrets come from env.ts.
declare namespace Cloudflare {
  interface Env extends VoidGeneratedEnvBindings {
    IMAGES: ImagesBinding
  }
}
