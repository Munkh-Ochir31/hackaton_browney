import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MBTILES_FILE = path.resolve(__dirname, 'osm-2020-02-10-v3.11_asia_mongolia.mbtiles');

type MetadataRow = {
  name: string;
  value: string;
};

type TileRow = {
  tile_data: Buffer;
};

function mbtilesPlugin(): Plugin {
  let db: Database.Database | null = null;
  let getTileStatement: Database.Statement<[number, number, number], TileRow> | null = null;
  let metadata: Record<string, string> = {};

  return {
    name: 'parkub-local-mbtiles',
    configureServer(server) {
      if (!fs.existsSync(MBTILES_FILE)) {
        console.warn(`[ParkUB] MBTiles file not found: ${MBTILES_FILE}`);
        return;
      }

      db = new Database(MBTILES_FILE, { readonly: true, fileMustExist: true });
      getTileStatement = db.prepare<[number, number, number], TileRow>(
        'select tile_data from tiles where zoom_level = ? and tile_column = ? and tile_row = ?',
      );

      const rows = db.prepare<[], MetadataRow>('select name, value from metadata').all();
      metadata = Object.fromEntries(rows.map((row) => [row.name, row.value]));

      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');

        if (url.pathname === '/api/mbtiles/metadata') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(metadata));
          return;
        }

        const tileMatch = /^\/api\/tiles\/(\d+)\/(\d+)\/(\d+)\.pbf$/.exec(url.pathname);

        if (!tileMatch || !getTileStatement) {
          next();
          return;
        }

        const z = Number(tileMatch[1]);
        const x = Number(tileMatch[2]);
        const y = Number(tileMatch[3]);
        const tmsY = 2 ** z - 1 - y;
        const row = getTileStatement.get(z, x, tmsY);

        if (!row) {
          res.statusCode = 204;
          res.end();
          return;
        }

        const tile = row.tile_data;
        const isGzipped = tile[0] === 0x1f && tile[1] === 0x8b;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/x-protobuf');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (isGzipped) {
          res.setHeader('Content-Encoding', 'gzip');
        }

        res.end(tile);
      });

      server.httpServer?.once('close', () => {
        db?.close();
        db = null;
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mbtilesPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
});
