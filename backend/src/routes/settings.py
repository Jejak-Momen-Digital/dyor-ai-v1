from flask import Blueprint, request, jsonify
from src.services.agent_service import AgentService
from src.services.settings_service import SettingsService

settings_bp = Blueprint('settings', __name__)
settings_service = SettingsService()

@settings_bp.route('/settings/agent', methods=['GET'])
def get_agent_settings():
    """Get current agent settings"""
    try:
        settings = settings_service.get_agent_settings()
        return jsonify({
            'success': True,
            'settings': settings
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/agent', methods=['POST'])
def update_agent_settings():
    """Update agent settings"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update settings
        updated_settings = settings_service.update_agent_settings(data)
        
        return jsonify({
            'success': True,
            'settings': updated_settings,
            'message': 'Agent settings updated successfully'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/models', methods=['GET'])
def get_available_models():
    """Get list of available AI models"""
    try:
        models = settings_service.get_available_models()
        return jsonify({
            'success': True,
            'models': models
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/test-connection', methods=['POST'])
def test_model_connection():
    """Test connection to a specific model"""
    try:
        data = request.get_json()
        model_config = data.get('model_config', {})
        
        result = settings_service.test_model_connection(model_config)
        
        return jsonify({
            'success': True,
            'result': result
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@settings_bp.route('/settings/reset', methods=['POST'])
def reset_settings():
    """Reset settings to default"""
    try:
        default_settings = settings_service.reset_to_default()
        
        return jsonify({
            'success': True,
            'settings': default_settings,
            'message': 'Settings reset to default'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

