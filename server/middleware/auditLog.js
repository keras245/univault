import AuditLog from '../models/AuditLog.js';

/**
 * Middleware pour logger automatiquement les actions
 * @param {string} action - Type d'action (login, upload, etc.)
 * @param {string} resource - Type de ressource (document, user, etc.)
 */
export const logAction = (action, resource) => {
    return async (req, res, next) => {
        // Sauvegarder la fonction send originale
        const originalSend = res.send;

        // Override de la fonction send pour logger après la réponse
        res.send = function (data) {
            // Logger uniquement si la requête est réussie (status 2xx)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const logData = {
                    user: req.user._id,
                    action,
                    resource,
                    resourceId: req.params.id || req.body._id || null,
                    details: {
                        method: req.method,
                        path: req.path,
                        body: sanitizeBody(req.body),
                        params: req.params,
                    },
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('user-agent'),
                };

                // Logger de manière asynchrone sans bloquer la réponse
                AuditLog.create(logData).catch(err => {
                    console.error('Erreur lors du logging:', err);
                });
            }

            // Appeler la fonction send originale
            originalSend.call(this, data);
        };

        next();
    };
};

/**
 * Sanitize le body pour ne pas logger les données sensibles
 */
const sanitizeBody = (body) => {
    if (!body) return {};

    const sanitized = { ...body };

    // Supprimer les champs sensibles
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.jwt;

    return sanitized;
};

/**
 * Logger manuellement une action
 */
export const createLog = async (userId, action, resource, details = {}) => {
    try {
        await AuditLog.create({
            user: userId,
            action,
            resource,
            details,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Erreur lors de la création du log:', error);
    }
};
