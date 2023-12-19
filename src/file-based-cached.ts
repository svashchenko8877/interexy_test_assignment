import fs from 'fs';
import path from 'path';

type CacheEntry = { value: any; expireAt: number };

export class FileCache {
    private cacheDir: string;

    constructor(cacheDir: string) {
        this.cacheDir = cacheDir;
    }

     set(key: string, value: any, ttl: number): void {
        const filePath = this.getFilePath(key);
        const expireAt = Date.now() + ttl * 1000;
        const cacheEntry: CacheEntry = { value, expireAt };
        fs.writeFileSync(filePath, JSON.stringify(cacheEntry), 'utf8');
    }

    get(key: string): null {
        try {
            const filePath = this.getFilePath(key);
            const data = fs.readFileSync(filePath, 'utf8');
            const cacheEntry: CacheEntry = JSON.parse(data);
            if (Date.now() > cacheEntry.expireAt) {
                this.delete(key);
                return null;
            }

            return cacheEntry.value;
        } catch(e) {
            return null;
        }
    }

     delete(key: string): void {
        try {
            const filePath = this.getFilePath(key);
            fs.unlinkSync(filePath);
        } catch {
            // Handle file not found or other errors
        }
    }

    private getFilePath(key: string): string {
        return path.join(this.cacheDir, `${key}.json`);
    }
}

// ** USAGE ** //
// const fileCache = new FileCache('./');
// fileCache.set('long_term_file', '12345', 10000)
// fileCache.set('test', '12345', 0)
// fileCache.get('test') // instant delete