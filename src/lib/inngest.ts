import { Inngest } from 'inngest';

export const inngest = new Inngest({ 
    id: 'rent-mvp2',
    isDev: process.env.NODE_ENV === 'development'
});
