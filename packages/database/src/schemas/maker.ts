/* eslint-disable sort-keys-fix/sort-keys-fix  */
import {
    boolean,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    varchar,
} from 'drizzle-orm/pg-core';

import { timestamps } from './_helpers';
import { users } from './user';
import { courses, lessons } from './education';

// Enums for maker workbench
export const projectStatusEnum = pgEnum('project_status', ['draft', 'active', 'completed', 'archived', 'shared']);
export const hardwareTypeEnum = pgEnum('hardware_type', ['esp32', 'arduino', 'raspberry_pi', 'modi', 'breadboard', 'custom']);
export const codeLanguageEnum = pgEnum('code_language', ['blockly', 'python', 'cpp', 'javascript', 'micropython']);
export const deploymentStatusEnum = pgEnum('deployment_status', ['pending', 'deploying', 'deployed', 'failed', 'offline']);

// Maker projects - hardware/software projects created by students
export const makerProjects = pgTable('maker_projects', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    courseId: text('course_id').references(() => courses.id), // Optional: linked to course
    lessonId: text('lesson_id').references(() => lessons.id), // Optional: linked to lesson

    // Project details
    title: text('title').notNull(),
    description: text('description'),
    status: projectStatusEnum('status').default('draft'),

    // Technical details
    hardwareType: hardwareTypeEnum('hardware_type').notNull(),
    codeLanguage: codeLanguageEnum('code_language').notNull(),

    // Code and configuration
    blocklyXml: text('blockly_xml'), // Visual block programming XML
    generatedCode: text('generated_code'), // Transpiled code (Python/C++)
    customCode: text('custom_code'), // Hand-written code modifications

    // Hardware configuration
    hardwareConfig: jsonb('hardware_config').default({}), // Pin assignments, component configs
    components: jsonb('components').$type<string[]>().default([]), // Required components
    wiring: jsonb('wiring').default([]), // Wiring diagrams/instructions

    // Files and resources
    schematicUrl: text('schematic_url'), // Circuit diagram
    pcbUrl: text('pcb_url'), // PCB design file
    cadFiles: jsonb('cad_files').default([]), // 3D models, STL files
    images: jsonb('images').$type<string[]>().default([]),
    videos: jsonb('videos').$type<string[]>().default([]),

    // Collaboration and sharing
    isPublic: boolean('is_public').default(false),
    allowRemix: boolean('allow_remix').default(true),
    remixedFrom: text('remixed_from').references(() => makerProjects.id),

    // Performance metrics
    views: integer('views').default(0),
    likes: integer('likes').default(0),
    remixes: integer('remixes').default(0),

    // AI assistance
    aiAssistanceLog: jsonb('ai_assistance_log').default([]), // AI help provided
    debuggingHistory: jsonb('debugging_history').default([]), // Debug sessions

    ...timestamps,
}, (t) => ({
    userIdx: index('maker_projects_user_idx').on(t.userId),
    courseIdx: index('maker_projects_course_idx').on(t.courseId),
    lessonIdx: index('maker_projects_lesson_idx').on(t.lessonId),
    statusIdx: index('maker_projects_status_idx').on(t.status),
    hardwareIdx: index('maker_projects_hardware_idx').on(t.hardwareType),
    publicIdx: index('maker_projects_public_idx').on(t.isPublic),
}));

export type NewMakerProject = typeof makerProjects.$inferInsert;
export type MakerProjectItem = typeof makerProjects.$inferSelect;

// Hardware devices - physical devices students can deploy to
export const devices = pgTable('maker_devices', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    // Device identification
    deviceId: text('device_id').notNull().unique(), // Physical device identifier
    name: text('name').notNull(),
    description: text('description'),

    // Device specifications
    hardwareType: hardwareTypeEnum('hardware_type').notNull(),
    model: varchar('model', { length: 100 }),
    firmwareVersion: varchar('firmware_version', { length: 50 }),

    // Network configuration
    ipAddress: varchar('ip_address', { length: 45 }), // IPv4/IPv6
    macAddress: varchar('mac_address', { length: 17 }),
    wifiSsid: varchar('wifi_ssid', { length: 100 }),

    // Status and monitoring
    deploymentStatus: deploymentStatusEnum('deployment_status').default('offline'),
    lastSeen: text('last_seen'),
    batteryLevel: integer('battery_level'), // 0-100
    temperature: integer('temperature'), // Celsius

    // Current deployment
    currentProjectId: text('current_project_id').references(() => makerProjects.id),
    deployedAt: text('deployed_at'),

    // Device capabilities
    capabilities: jsonb('capabilities').default([]), // Sensors, actuators available
    pinConfiguration: jsonb('pin_configuration').default({}),

    // Settings
    isActive: boolean('is_active').default(true),
    allowRemoteAccess: boolean('allow_remote_access').default(false),

    ...timestamps,
}, (t) => ({
    userIdx: index('maker_devices_user_idx').on(t.userId),
    deviceIdIdx: index('maker_devices_device_id_idx').on(t.deviceId),
    hardwareTypeIdx: index('maker_devices_hardware_type_idx').on(t.hardwareType),
    statusIdx: index('maker_devices_status_idx').on(t.deploymentStatus),
    currentProjectIdx: index('maker_devices_current_project_idx').on(t.currentProjectId),
}));

export type NewDevice = typeof devices.$inferInsert;
export type DeviceItem = typeof devices.$inferSelect;

// Device telemetry and sensor data
export const deviceTelemetry = pgTable('maker_device_telemetry', {
    id: text('id').primaryKey().notNull(),
    deviceId: text('device_id').references(() => devices.deviceId, { onDelete: 'cascade' }).notNull(),

    // Telemetry data
    timestamp: text('timestamp').notNull(),
    sensorData: jsonb('sensor_data').notNull(), // All sensor readings
    systemStats: jsonb('system_stats').default({}), // CPU, memory, etc.

    // Error tracking
    errorCount: integer('error_count').default(0),
    warnings: jsonb('warnings').$type<string[]>().default([]),
    errors: jsonb('errors').$type<string[]>().default([]),

    ...timestamps,
}, (t) => ({
    deviceIdx: index('maker_device_telemetry_device_idx').on(t.deviceId),
    timestampIdx: index('maker_device_telemetry_timestamp_idx').on(t.timestamp),
}));

export type NewDeviceTelemetry = typeof deviceTelemetry.$inferInsert;
export type DeviceTelemetryItem = typeof deviceTelemetry.$inferSelect;

// Code submissions and deployment history
export const codeDeployments = pgTable('maker_code_deployments', {
    id: text('id').primaryKey().notNull(),
    projectId: text('project_id').references(() => makerProjects.id, { onDelete: 'cascade' }).notNull(),
    deviceId: text('device_id').references(() => devices.deviceId, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    // Deployment details
    version: varchar('version', { length: 50 }).notNull(),
    deploymentStatus: deploymentStatusEnum('deployment_status').default('pending'),

    // Code snapshot
    codeSnapshot: text('code_snapshot').notNull(), // Code at time of deployment
    blocklySnapshot: text('blockly_snapshot'), // Blockly XML at deployment
    configSnapshot: jsonb('config_snapshot').default({}),

    // Deployment process
    buildLog: text('build_log'),
    deploymentLog: text('deployment_log'),
    errorLog: text('error_log'),

    // Performance
    buildTimeMs: integer('build_time_ms'),
    deploymentTimeMs: integer('deployment_time_ms'),

    // Results
    deployedAt: text('deployed_at'),
    failedAt: text('failed_at'),
    rollbackAt: text('rollback_at'),

    ...timestamps,
}, (t) => ({
    projectIdx: index('maker_code_deployments_project_idx').on(t.projectId),
    deviceIdx: index('maker_code_deployments_device_idx').on(t.deviceId),
    userIdx: index('maker_code_deployments_user_idx').on(t.userId),
    statusIdx: index('maker_code_deployments_status_idx').on(t.deploymentStatus),
    deployedIdx: index('maker_code_deployments_deployed_idx').on(t.deployedAt),
}));

export type NewCodeDeployment = typeof codeDeployments.$inferInsert;
export type CodeDeploymentItem = typeof codeDeployments.$inferSelect;

// Project collaboration and sharing
export const projectCollaborators = pgTable('maker_project_collaborators', {
    projectId: text('project_id').references(() => makerProjects.id, { onDelete: 'cascade' }).notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    // Collaboration details
    role: varchar('role', { length: 20 }).default('collaborator'), // owner, collaborator, viewer
    permissions: jsonb('permissions').$type<string[]>().default([]), // edit_code, deploy, manage_sharing

    invitedAt: text('invited_at').notNull(),
    acceptedAt: text('accepted_at'),

    ...timestamps,
}, (t) => ({
    projectIdx: index('maker_project_collaborators_project_idx').on(t.projectId),
    userIdx: index('maker_project_collaborators_user_idx').on(t.userId),
}));

export type NewProjectCollaborator = typeof projectCollaborators.$inferInsert;
export type ProjectCollaboratorItem = typeof projectCollaborators.$inferSelect;