import util from 'util';
import fs from 'fs/promises';
import path from 'path';

export async function printJsonToFile(value, label = 'output') {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const safeLabel = String(label || 'output').replace(/\.json$/i, '').replace(/[^a-z0-9-_]/gi, '_') || 'output';
    const outName = `${safeLabel}-${ts}.json`;
    const outDir = path.resolve(process.cwd(), 'logs');
    const outPath = path.join(outDir, outName);

    let payloadStr;
    if (typeof value === 'string') {
        payloadStr = value;
    } else {
        try {
            payloadStr = JSON.stringify(value, null, 2);
        } catch (err) {
            payloadStr = util.inspect(value, { depth: null });
        }
    }

    try {
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(outPath, payloadStr, 'utf8');
        return outPath;
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Failed to write JSON to file: ${err.message}`);
        return null;
    }
}

export default printJsonToFile;
