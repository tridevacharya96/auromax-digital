import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = 'Auromax Digital';

createInertiaApp({
    title: (title) => `${title} — ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#6c63ff',
    },
}).catch(console.error);
