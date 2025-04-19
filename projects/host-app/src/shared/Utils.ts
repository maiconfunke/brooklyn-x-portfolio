export class Utils {

  constructor(){}
  
  public generateUUID(): string {
    return  [...crypto.getRandomValues(new Uint8Array(12))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 12);
  }
}
