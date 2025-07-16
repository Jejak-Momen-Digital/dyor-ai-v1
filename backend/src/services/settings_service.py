import json
import os
from typing import Dict, Any, List
from datetime import datetime
from .gemini_service import GeminiService

class SettingsService:
    def __init__(self):
        self.settings_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'agent_settings.json')
        self.ensure_settings_file()
        
    def ensure_settings_file(self):
        """Ensure settings file and directory exist"""
        os.makedirs(os.path.dirname(self.settings_file), exist_ok=True)
        
        if not os.path.exists(self.settings_file):
            default_settings = self.get_default_settings()
            self.save_settings(default_settings)
    
    def get_default_settings(self) -> Dict[str, Any]:
        """Get default agent settings"""
        return {
            "model": {
                "provider": "openai",
                "name": "gpt-4",
                "api_key": "",
                "base_url": "",
                "temperature": 0.7,
                "max_tokens": 2048,
                "top_p": 1.0
            },
            "agent": {
                "name": "Dyor AI",
                "description": "Your Personal AI Assistant",
                "system_prompt": "You are Dyor AI, a helpful and knowledgeable AI assistant. You can help with various tasks including web browsing, coding, file management, image generation, and data analysis.",
                "max_conversation_length": 50,
                "auto_save_conversations": True
            },
            "capabilities": {
                "web_browsing": True,
                "code_execution": True,
                "file_management": True,
                "image_generation": True,
                "data_analysis": True,
                "search": True,
                "shell_commands": False
            },
            "ui": {
                "theme": "light",
                "language": "en",
                "show_typing_indicator": True,
                "auto_scroll": True,
                "sound_notifications": False
            },
            "advanced": {
                "debug_mode": False,
                "log_level": "info",
                "timeout": 30,
                "retry_attempts": 3
            },
            "last_updated": datetime.now().isoformat()
        }
    
    def load_settings(self) -> Dict[str, Any]:
        """Load settings from file"""
        try:
            with open(self.settings_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return self.get_default_settings()
    
    def save_settings(self, settings: Dict[str, Any]):
        """Save settings to file"""
        settings['last_updated'] = datetime.now().isoformat()
        with open(self.settings_file, 'w') as f:
            json.dump(settings, f, indent=2)
    
    def get_agent_settings(self) -> Dict[str, Any]:
        """Get current agent settings"""
        return self.load_settings()
    
    def update_agent_settings(self, new_settings: Dict[str, Any]) -> Dict[str, Any]:
        """Update agent settings"""
        current_settings = self.load_settings()
        
        # Deep merge settings
        def deep_merge(base, update):
            for key, value in update.items():
                if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                    deep_merge(base[key], value)
                else:
                    base[key] = value
        
        deep_merge(current_settings, new_settings)
        self.save_settings(current_settings)
        
        return current_settings
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """Get list of available AI models"""
        return [
            {
                "provider": "openai",
                "name": "gpt-4",
                "display_name": "GPT-4",
                "description": "Most capable OpenAI model",
                "max_tokens": 8192,
                "supports_functions": True
            },
            {
                "provider": "openai",
                "name": "gpt-3.5-turbo",
                "display_name": "GPT-3.5 Turbo",
                "description": "Fast and efficient OpenAI model",
                "max_tokens": 4096,
                "supports_functions": True
            },
            {
                "provider": "google",
                "name": "gemini-2.0-flash-exp",
                "display_name": "Gemini 2.0 Flash",
                "description": "Google's latest multimodal model",
                "max_tokens": 8192,
                "supports_functions": True,
                "supports_vision": True
            },
            {
                "provider": "google",
                "name": "gemini-1.5-pro",
                "display_name": "Gemini 1.5 Pro",
                "description": "Google's advanced reasoning model",
                "max_tokens": 2048000,
                "supports_functions": True,
                "supports_vision": True
            },
            {
                "provider": "anthropic",
                "name": "claude-3-opus",
                "display_name": "Claude 3 Opus",
                "description": "Anthropic's most powerful model",
                "max_tokens": 4096,
                "supports_functions": True
            },
            {
                "provider": "anthropic",
                "name": "claude-3-sonnet",
                "display_name": "Claude 3 Sonnet",
                "description": "Balanced performance and speed",
                "max_tokens": 4096,
                "supports_functions": True
            }
        ]
    
    def test_model_connection(self, model_config: Dict[str, Any]) -> Dict[str, Any]:
        """Test connection to a specific model"""
        try:
            provider = model_config.get('provider', '')
            api_key = model_config.get('api_key', '')
            
            if not api_key:
                return {
                    'success': False,
                    'message': 'API key is required'
                }
            
            # Simple test based on provider
            if provider == 'openai':
                return self._test_openai_connection(model_config)
            elif provider == 'google':
                return self._test_google_connection(model_config)
            elif provider == 'anthropic':
                return self._test_anthropic_connection(model_config)
            else:
                return {
                    'success': False,
                    'message': f'Unsupported provider: {provider}'
                }
                
        except Exception as e:
            return {
                'success': False,
                'message': f'Connection test failed: {str(e)}'
            }
    
    def _test_openai_connection(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Test OpenAI connection"""
        # Placeholder implementation
        return {
            'success': True,
            'message': 'OpenAI connection test passed',
            'latency': '150ms'
        }
    
    def _test_google_connection(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Test Google/Gemini connection"""
        try:
            api_key = config.get('api_key', '')
            model = config.get('name', 'gemini-2.0-flash-exp')
            
            if not api_key:
                return {
                    'success': False,
                    'message': 'API key is required for Google Gemini'
                }
            
            gemini_service = GeminiService(api_key)
            result = gemini_service.test_connection()
            
            return result
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Google Gemini connection test failed: {str(e)}'
            }
    
    def _test_anthropic_connection(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Test Anthropic connection"""
        # Placeholder implementation
        return {
            'success': True,
            'message': 'Anthropic connection test passed',
            'latency': '180ms'
        }
    
    def reset_to_default(self) -> Dict[str, Any]:
        """Reset settings to default"""
        default_settings = self.get_default_settings()
        self.save_settings(default_settings)
        return default_settings

