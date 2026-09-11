declare module "wawoff2" {
  export function decompress(dane: Uint8Array): Promise<Uint8Array>;
  export function compress(dane: Uint8Array): Promise<Uint8Array>;
}
