import express from 'express';
import { userRoutes } from '../modules/User/user.routes.js';
import { matchRoutes } from '../modules/Liked/match.route.js';
import { swipeRoutes } from '../modules/Swipe/swipe.routes.js';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { giftroutes } from '../modules/Gift/gift.route.js';
import { discoveryRouter } from '../modules/Discovery/discovery.route.js';
import { chatRoutes } from '../modules/chat/chat.route.js';
import clubHouseRoutes from '../modules/Clubhouse/clubhouse.route.js';
import subscriptionRoutes from '../modules/subscription/subscription.route.js';
import walletRoutes from '../modules/wallet/wallet.route.js';
// import { notificationRoutes } from '../modules/notification/notification.router.js';

// import { AuthRoutes } '../modules/auth/auth.routes.js';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/swipe',
        route: swipeRoutes
    },
    {
        path: '/match',
        route: matchRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/gift',
        route: giftroutes
    },
    {
        path: '/discovery',
        route: discoveryRouter
    },
    {
        path: '/chat',
        route: chatRoutes
    },
    {
        path: '/clubhouse',
        route: clubHouseRoutes
    },
    {
        path: '/subscription',
        route: subscriptionRoutes
    },
    {
        path: '/wallet',
        route: walletRoutes
    },
    // {
    //     path: '/notification',
    //     route: notificationRoutes
    // }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;