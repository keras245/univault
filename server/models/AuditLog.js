import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
        enum: [
            'login',
            'logout',
            'upload',
            'download',
            'view',
            'delete',
            'update',
            'create_user',
            'delete_user',
            'update_user',
        ],
    },
    resource: {
        type: String,
        required: true,
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false,
});

// Index pour améliorer les performances de recherche des logs
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
