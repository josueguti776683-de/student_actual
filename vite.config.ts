import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const mockHmrPlugin = () => ({
  name: 'mock-hmr-plugin',
  configureServer(server: any) {
    if (!server.ws) {
      server.ws = {
        send: () => {},
        on: () => {},
        off: () => {},
        close: () => {},
        listen: () => {},
      };
    } else {
      const originalSend = server.ws.send;
      server.ws.send = function (this: any, ...args: any[]) {
        try {
          if (originalSend) {
            return originalSend.apply(this, args);
          }
        } catch (e) {
          // ignore
        }
      };
    }

    if (server.hot) {
      const originalHotSend = server.hot.send;
      server.hot.send = function (this: any, ...args: any[]) {
        try {
          if (originalHotSend) {
            return originalHotSend.apply(this, args);
          }
        } catch (e) {
          // ignore
        }
      };
    } else {
      server.hot = {
        send: () => {},
        on: () => {},
        off: () => {},
      };
    }
  },
});

export default defineConfig(() => {
  return {
    plugins: [
      mockHmrPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        injectRegister: 'inline',
        includeAssets: [
          'icon-192.png',
          'icon-512.png',
          'screenshot-1.png',
          'screenshot-2.png',
          'icon.svg'
        ],
        manifest: {
          id: '/',
          name: 'STUDENT 1',
          short_name: 'STUDENT 1',
          description: 'Commercial English Learning System - STUDENT 1',
          start_url: '/',
          scope: '/',
          lang: 'es',
          dir: 'ltr',
          display: 'standalone',
          display_override: ['standalone', 'window-controls-overlay'],
          background_color: '#000000',
          theme_color: '#000000',
          orientation: 'portrait-primary',
          categories: ['education', 'utilities'],
          prefer_related_applications: false,
          iarc_rating_id: 'e8aa5a4c-53dc-4fc4-8e11-64d8db1cb41d',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          screenshots: [
            {
              src: '/screenshot-1.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide'
            },
            {
              src: '/screenshot-2.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'narrow'
            }
          ],
          shortcuts: [
            {
              name: 'Iniciar Práctica',
              short_name: 'Práctica',
              description: 'Comienza una sesión de práctica interactiva de 5 minutos',
              url: '/?shortcut=practice',
              icons: [
                {
                  src: '/icon-192.png',
                  sizes: '192x192'
                }
              ]
            },
            {
              name: 'Examen de Estudiante',
              short_name: 'Examen',
              description: 'Realiza la evaluación de inglés de STUDENT 1',
              url: '/?shortcut=exam',
              icons: [
                {
                  src: '/icon-192.png',
                  sizes: '192x192'
                }
              ]
            }
          ],
          file_handlers: [
            {
              action: '/?file=open',
              accept: {
                'text/plain': ['.txt'],
                'application/json': ['.json']
              }
            }
          ],
          launch_handler: {
            client_mode: ['navigate-new', 'focus-existing']
          },
          protocol_handlers: [
            {
              protocol: 'web+student1',
              url: '/?protocol=%s'
            }
          ],
          related_applications: [
            {
              platform: 'play',
              url: 'https://play.google.com/store/apps/details?id=com.student1.commercial_english',
              id: 'com.student1.commercial_english'
            }
          ],
          share_target: {
            action: '/share-target',
            method: 'GET',
            enctype: 'application/x-www-form-urlencoded',
            params: {
              title: 'title',
              text: 'text',
              url: 'url'
            }
          },
          widgets: [
            {
              name: 'STUDENT 1 Vocabulario',
              short_name: 'Vocabulario',
              description: 'Palabras y frases del día en inglés comercial',
              tag: 'vocab-widget',
              template: 'vocab-widget-template',
              ms_ac_template: 'vocab-widget-ac',
              data: '/widgets/vocab-data.json',
              type: 'application/json',
              screenshots: [
                {
                  src: '/screenshot-1.png',
                  sizes: '1280x720',
                  type: 'image/png'
                }
              ]
            }
          ],
          edge_side_panel: {
            preferred_width: 480
          },
          note_taking: {
            new_note_url: '/?note=new'
          },
          scope_extensions: [
            {
              origin: '*.student1.app'
            },
            {
              origin: '*.student1.dev'
            }
          ]
        } as any,
        devOptions: {
          enabled: false
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
