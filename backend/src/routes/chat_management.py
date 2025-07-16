from flask import Blueprint, request, jsonify
from src.services.chat_manager import ChatManager

chat_mgmt_bp = Blueprint('chat_management', __name__)
chat_manager = ChatManager()

@chat_mgmt_bp.route('/sessions', methods=['GET'])
def get_sessions():
    """Get list of chat sessions"""
    try:
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        result = chat_manager.get_sessions(limit=limit, offset=offset)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get sessions: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/sessions', methods=['POST'])
def create_session():
    """Create a new chat session"""
    try:
        data = request.get_json() or {}
        title = data.get('title')
        template_id = data.get('template_id')
        
        result = chat_manager.create_session(title=title, template_id=template_id)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to create session: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get a specific chat session with messages"""
    try:
        result = chat_manager.get_session(session_id)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get session: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/sessions/<session_id>', methods=['PUT'])
def update_session(session_id):
    """Update chat session details"""
    try:
        data = request.get_json() or {}
        title = data.get('title')
        
        result = chat_manager.update_session(session_id, title=title)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to update session: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a chat session"""
    try:
        result = chat_manager.delete_session(session_id)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to delete session: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/sessions/<session_id>/messages', methods=['POST'])
def add_message(session_id):
    """Add a message to a chat session"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        role = data.get('role')
        content = data.get('content')
        metadata = data.get('metadata')
        
        if not role or not content:
            return jsonify({
                'success': False,
                'error': 'Role and content are required'
            }), 400
        
        result = chat_manager.add_message(session_id, role, content, metadata)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to add message: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/sessions/<session_id>/clear', methods=['POST'])
def clear_session(session_id):
    """Clear all messages from a chat session"""
    try:
        result = chat_manager.clear_session(session_id)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to clear session: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/search', methods=['GET'])
def search_sessions():
    """Search chat sessions"""
    try:
        query = request.args.get('q', '').strip()
        limit = request.args.get('limit', 20, type=int)
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query is required'
            }), 400
        
        result = chat_manager.search_sessions(query, limit=limit)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to search sessions: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/templates', methods=['GET'])
def get_templates():
    """Get available chat templates"""
    try:
        result = chat_manager.get_templates()
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get templates: {str(e)}'
        }), 500

@chat_mgmt_bp.route('/templates', methods=['POST'])
def create_template():
    """Create a new chat template"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        name = data.get('name')
        description = data.get('description', '')
        system_prompt = data.get('system_prompt')
        initial_messages = data.get('initial_messages', [])
        tags = data.get('tags', [])
        
        if not name or not system_prompt:
            return jsonify({
                'success': False,
                'error': 'Name and system_prompt are required'
            }), 400
        
        result = chat_manager.create_template(
            name=name,
            description=description,
            system_prompt=system_prompt,
            initial_messages=initial_messages,
            tags=tags
        )
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to create template: {str(e)}'
        }), 500

