import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, ...args: any[]): unknown {
        const [length] = args;
        return (value.length > length) ? this.trimmed(value.substring(0, length - 1).trim()) + '...' : value;
    }

    trimmed(value: string) {
        return value.substring(0, Math.min(value.length, value.lastIndexOf(' '))).replace(/,\s*$/, "");
    }
}
