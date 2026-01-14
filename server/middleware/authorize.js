/**
 * Middleware d'autorisation basé sur les rôles (RBAC)
 * @param  {...string} roles - Rôles autorisés
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non authentifié.',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé. Permissions insuffisantes.',
            });
        }

        next();
    };
};

/**
 * Middleware pour vérifier l'accès au service
 * Permet l'accès si l'utilisateur appartient au service ou est admin
 */
export const authorizeService = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Non authentifié.',
        });
    }

    // Les super-admin ont accès à tout
    if (req.user.role === 'super-admin') {
        return next();
    }

    // Récupérer le service depuis les params, query ou body
    const requestedService = req.params.service || req.query.service || req.body.service;

    if (!requestedService) {
        return next(); // Pas de restriction si aucun service spécifié
    }

    // Vérifier si l'utilisateur a accès au service
    if (req.user.service !== requestedService && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé. Vous n\'avez pas accès à ce service.',
        });
    }

    next();
};

/**
 * Middleware pour vérifier la propriété d'une ressource
 * Permet l'accès si l'utilisateur est le propriétaire ou admin
 */
export const authorizeOwnership = (resourceField = 'uploadedBy') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non authentifié.',
            });
        }

        // Les admin et super-admin ont accès à tout
        if (req.user.role === 'admin' || req.user.role === 'super-admin') {
            return next();
        }

        // Vérifier la propriété (sera vérifié dans le controller)
        req.ownershipField = resourceField;
        next();
    };
};
