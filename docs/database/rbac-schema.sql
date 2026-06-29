-- PARAKH LAT RBAC schema for PostgreSQL.
-- Roles and permissions are intentionally separated so future roles can be added without migrations.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(160) NOT NULL,
  code VARCHAR(60) UNIQUE NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(180) NOT NULL,
  code VARCHAR(80) NOT NULL,
  district VARCHAR(120),
  status VARCHAR(24) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  name VARCHAR(160) NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'invited',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  status VARCHAR(24) NOT NULL DEFAULT 'active',
  is_system_role BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(120) UNIQUE NOT NULL,
  resource VARCHAR(80) NOT NULL,
  action VARCHAR(80) NOT NULL,
  name VARCHAR(140) NOT NULL,
  description TEXT,
  status VARCHAR(24) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (resource, action)
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id UUID,
  action VARCHAR(80) NOT NULL,
  before_value JSONB,
  after_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_permissions_code ON permissions(code);
CREATE INDEX idx_roles_code ON roles(code);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);

INSERT INTO roles (code, name, description, is_system_role)
VALUES
  ('super_admin', 'Super Admin', 'Full system access.', true),
  ('organization_admin', 'Organization Admin', 'Organization, school, teacher, reviewer, and assessment administration.', true),
  ('curriculum_manager', 'Curriculum Manager', 'Curriculum hierarchy and competency management.', true),
  ('question_author', 'Question Author', 'Question generation and authoring.', true),
  ('reviewer', 'Reviewer', 'Question review, approval, rejection, and publishing.', true),
  ('assessment_manager', 'Assessment Manager', 'Assessment creation, blueprint, publishing, and scheduling.', true),
  ('teacher', 'Teacher', 'Assessment assignment and student reporting.', true),
  ('student', 'Student', 'Assessment attempts and personal results.', true),
  ('regional_officer', 'Regional Officer', 'Regional reporting and analytics.', true)
ON CONFLICT (code) DO NOTHING;
