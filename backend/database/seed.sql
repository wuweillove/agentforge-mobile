-- AgentForge Database Seed Data

-- Insert demo admin user
-- Password: AdminPass123!
-- Hashed with bcrypt (10 rounds)
INSERT INTO users (email, password, name, subscription_tier)
VALUES (
  'admin@agentforge.io',
  '$2a$10$YourHashedPasswordHere', -- Replace with actual hash
  'Admin User',
  'enterprise'
)
ON CONFLICT (email) DO NOTHING;

-- Insert demo users
INSERT INTO users (email, password, name, subscription_tier)
VALUES 
  ('user1@example.com', '$2a$10$DemoHashedPassword1', 'John Doe', 'free'),
  ('user2@example.com', '$2a$10$DemoHashedPassword2', 'Jane Smith', 'premium'),
  ('user3@example.com', '$2a$10$DemoHashedPassword3', 'Bob Johnson', 'enterprise')
ON CONFLICT (email) DO NOTHING;

-- Initialize credits for demo users
INSERT INTO credits (user_id, balance)
SELECT id, 
  CASE 
    WHEN subscription_tier = 'free' THEN 50
    WHEN subscription_tier = 'premium' THEN 500
    WHEN subscription_tier = 'enterprise' THEN 5000
    ELSE 0
  END
FROM users
WHERE email LIKE '%@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- Insert demo workflow templates
INSERT INTO workflows (user_id, name, description, nodes, connections, status)
SELECT 
  (SELECT id FROM users WHERE email = 'user2@example.com'),
  'Data Processing Pipeline',
  'Extract, transform, and load data from various sources',
  '[
    {"id": "node-1", "type": "input", "label": "Data Source", "position": {"x": 50, "y": 100}},
    {"id": "node-2", "type": "process", "label": "Transform", "position": {"x": 250, "y": 100}},
    {"id": "node-3", "type": "output", "label": "Store Results", "position": {"x": 450, "y": 100}}
  ]'::jsonb,
  '[
    {"id": "conn-1", "from": "node-1", "to": "node-2"},
    {"id": "conn-2", "from": "node-2", "to": "node-3"}
  ]'::jsonb,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM workflows WHERE name = 'Data Processing Pipeline');

INSERT INTO workflows (user_id, name, description, nodes, connections, status)
SELECT 
  (SELECT id FROM users WHERE email = 'user3@example.com'),
  'Email Automation',
  'Automated email campaigns with personalization',
  '[
    {"id": "node-1", "type": "input", "label": "Contact List", "position": {"x": 50, "y": 100}},
    {"id": "node-2", "type": "ai_agent", "label": "Personalize", "position": {"x": 250, "y": 100}},
    {"id": "node-3", "type": "api_call", "label": "Send Email", "position": {"x": 450, "y": 100}}
  ]'::jsonb,
  '[
    {"id": "conn-1", "from": "node-1", "to": "node-2"},
    {"id": "conn-2", "from": "node-2", "to": "node-3"}
  ]'::jsonb,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM workflows WHERE name = 'Email Automation');

-- Insert demo credit transactions
INSERT INTO credit_transactions (user_id, type, amount, source, balance_after)
SELECT 
  id,
  'credit',
  500,
  'initial_grant',
  500
FROM users
WHERE email = 'user2@example.com'
ON CONFLICT DO NOTHING;

-- Insert demo workflow executions
INSERT INTO workflow_executions (workflow_id, user_id, status, nodes_executed, duration_ms, credits_charged, completed_at)
SELECT 
  w.id,
  w.user_id,
  'success',
  3,
  2300,
  1.5,
  NOW() - INTERVAL '1 hour'
FROM workflows w
WHERE w.name = 'Data Processing Pipeline'
LIMIT 1;

INSERT INTO workflow_executions (workflow_id, user_id, status, nodes_executed, duration_ms, credits_charged, completed_at)
SELECT 
  w.id,
  w.user_id,
  'success',
  3,
  1800,
  1.5,
  NOW() - INTERVAL '2 hours'
FROM workflows w
WHERE w.name = 'Email Automation'
LIMIT 1;
