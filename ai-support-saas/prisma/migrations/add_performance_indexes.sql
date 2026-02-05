-- Add performance indexes for faster queries
-- Run this migration to improve database query performance

-- Workspace Members Index (for permission checks)
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_user 
ON "WorkspaceMember"("workspaceId", "userId");

CREATE INDEX IF NOT EXISTS idx_workspace_members_user 
ON "WorkspaceMember"("userId");

-- Documents Index (for workspace document queries)
CREATE INDEX IF NOT EXISTS idx_documents_workspace 
ON "Document"("workspaceId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_documents_status 
ON "Document"("workspaceId", "status");

-- Document Chunks Index (for RAG queries)
CREATE INDEX IF NOT EXISTS idx_chunks_workspace 
ON "DocumentChunk"("workspaceId");

CREATE INDEX IF NOT EXISTS idx_chunks_document 
ON "DocumentChunk"("documentId");

-- Messages Index (for conversation queries)
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
ON "Message"("conversationId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_messages_role 
ON "Message"("conversationId", "role");

-- Conversations Index (for workspace conversation queries)
CREATE INDEX IF NOT EXISTS idx_conversations_workspace 
ON "Conversation"("workspaceId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_session 
ON "Conversation"("workspaceId", "sessionId");

-- Sessions Index (for auth queries)
CREATE INDEX IF NOT EXISTS idx_sessions_user 
ON "Session"("userId");

CREATE INDEX IF NOT EXISTS idx_sessions_token 
ON "Session"("sessionToken");

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_documents_workspace_status_date 
ON "Document"("workspaceId", "status", "createdAt" DESC);

-- Analyze tables to update statistics
ANALYZE "WorkspaceMember";
ANALYZE "Document";
ANALYZE "DocumentChunk";
ANALYZE "Message";
ANALYZE "Conversation";
ANALYZE "Session";
