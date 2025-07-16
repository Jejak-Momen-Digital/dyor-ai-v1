import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from src.models.user import db
from src.models.chat import ChatSession, ChatMessage, ChatTemplate

class ChatManager:
    def __init__(self):
        pass
    
    def create_session(self, title: str = None, template_id: str = None) -> Dict[str, Any]:
        """Create a new chat session"""
        try:
            session_id = str(uuid.uuid4())
            
            # Use template if provided
            if template_id:
                template = ChatTemplate.query.get(template_id)
                if template:
                    title = title or f"Chat with {template.name}"
                else:
                    title = title or "New Chat"
            else:
                title = title or "New Chat"
            
            session = ChatSession(
                id=session_id,
                title=title,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            db.session.add(session)
            
            # Add initial messages from template
            if template_id:
                template = ChatTemplate.query.get(template_id)
                if template and template.initial_messages:
                    for msg in template.initial_messages:
                        message = ChatMessage(
                            id=str(uuid.uuid4()),
                            session_id=session_id,
                            role=msg.get('role', 'assistant'),
                            content=msg.get('content', ''),
                            timestamp=datetime.utcnow()
                        )
                        db.session.add(message)
            
            db.session.commit()
            
            return {
                'success': True,
                'session': session.to_dict(),
                'message': 'Chat session created successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'error': f'Failed to create chat session: {str(e)}'
            }
    
    def get_sessions(self, limit: int = 50, offset: int = 0) -> Dict[str, Any]:
        """Get list of chat sessions"""
        try:
            sessions = ChatSession.query.filter_by(is_active=True)\
                                      .order_by(ChatSession.updated_at.desc())\
                                      .limit(limit)\
                                      .offset(offset)\
                                      .all()
            
            total_count = ChatSession.query.filter_by(is_active=True).count()
            
            return {
                'success': True,
                'sessions': [session.to_dict() for session in sessions],
                'total_count': total_count,
                'limit': limit,
                'offset': offset
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to get chat sessions: {str(e)}'
            }
    
    def get_session(self, session_id: str) -> Dict[str, Any]:
        """Get a specific chat session with messages"""
        try:
            session = ChatSession.query.get(session_id)
            if not session or not session.is_active:
                return {
                    'success': False,
                    'error': 'Chat session not found'
                }
            
            messages = ChatMessage.query.filter_by(session_id=session_id)\
                                       .order_by(ChatMessage.timestamp.asc())\
                                       .all()
            
            return {
                'success': True,
                'session': session.to_dict(),
                'messages': [message.to_dict() for message in messages]
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to get chat session: {str(e)}'
            }
    
    def update_session(self, session_id: str, title: str = None) -> Dict[str, Any]:
        """Update chat session details"""
        try:
            session = ChatSession.query.get(session_id)
            if not session or not session.is_active:
                return {
                    'success': False,
                    'error': 'Chat session not found'
                }
            
            if title:
                session.title = title
            
            session.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'success': True,
                'session': session.to_dict(),
                'message': 'Chat session updated successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'error': f'Failed to update chat session: {str(e)}'
            }
    
    def delete_session(self, session_id: str) -> Dict[str, Any]:
        """Delete a chat session (soft delete)"""
        try:
            session = ChatSession.query.get(session_id)
            if not session:
                return {
                    'success': False,
                    'error': 'Chat session not found'
                }
            
            session.is_active = False
            session.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'success': True,
                'message': 'Chat session deleted successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'error': f'Failed to delete chat session: {str(e)}'
            }
    
    def add_message(self, session_id: str, role: str, content: str, metadata: Dict = None) -> Dict[str, Any]:
        """Add a message to a chat session"""
        try:
            session = ChatSession.query.get(session_id)
            if not session or not session.is_active:
                return {
                    'success': False,
                    'error': 'Chat session not found'
                }
            
            message = ChatMessage(
                id=str(uuid.uuid4()),
                session_id=session_id,
                role=role,
                content=content,
                timestamp=datetime.utcnow(),
                metadata=metadata
            )
            
            db.session.add(message)
            
            # Update session timestamp
            session.updated_at = datetime.utcnow()
            
            # Auto-generate title from first user message
            if role == 'user' and session.title == 'New Chat':
                # Take first 50 characters as title
                title = content[:50].strip()
                if len(content) > 50:
                    title += "..."
                session.title = title
            
            db.session.commit()
            
            return {
                'success': True,
                'message': message.to_dict(),
                'session': session.to_dict()
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'error': f'Failed to add message: {str(e)}'
            }
    
    def clear_session(self, session_id: str) -> Dict[str, Any]:
        """Clear all messages from a chat session"""
        try:
            session = ChatSession.query.get(session_id)
            if not session or not session.is_active:
                return {
                    'success': False,
                    'error': 'Chat session not found'
                }
            
            # Delete all messages
            ChatMessage.query.filter_by(session_id=session_id).delete()
            
            # Reset session title
            session.title = 'New Chat'
            session.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return {
                'success': True,
                'message': 'Chat session cleared successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'error': f'Failed to clear chat session: {str(e)}'
            }
    
    def search_sessions(self, query: str, limit: int = 20) -> Dict[str, Any]:
        """Search chat sessions by title or message content"""
        try:
            # Search by session title
            title_matches = ChatSession.query.filter(
                ChatSession.is_active == True,
                ChatSession.title.contains(query)
            ).limit(limit).all()
            
            # Search by message content
            message_matches = db.session.query(ChatSession).join(ChatMessage).filter(
                ChatSession.is_active == True,
                ChatMessage.content.contains(query)
            ).distinct().limit(limit).all()
            
            # Combine and deduplicate results
            all_sessions = {session.id: session for session in title_matches + message_matches}
            
            return {
                'success': True,
                'sessions': [session.to_dict() for session in all_sessions.values()],
                'query': query,
                'total_found': len(all_sessions)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to search chat sessions: {str(e)}'
            }
    
    def get_templates(self) -> Dict[str, Any]:
        """Get available chat templates"""
        try:
            templates = ChatTemplate.query.filter_by(is_public=True)\
                                         .order_by(ChatTemplate.created_at.desc())\
                                         .all()
            
            return {
                'success': True,
                'templates': [template.to_dict() for template in templates]
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to get chat templates: {str(e)}'
            }
    
    def create_template(self, name: str, description: str, system_prompt: str, 
                       initial_messages: List[Dict] = None, tags: List[str] = None) -> Dict[str, Any]:
        """Create a new chat template"""
        try:
            template = ChatTemplate(
                id=str(uuid.uuid4()),
                name=name,
                description=description,
                system_prompt=system_prompt,
                initial_messages=initial_messages or [],
                tags=tags or [],
                created_at=datetime.utcnow()
            )
            
            db.session.add(template)
            db.session.commit()
            
            return {
                'success': True,
                'template': template.to_dict(),
                'message': 'Chat template created successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'error': f'Failed to create chat template: {str(e)}'
            }

