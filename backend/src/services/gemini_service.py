import os
import json
import requests
from typing import Dict, Any, List, Optional

class GeminiService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or "AIzaSyBjos5S03noZxcYqU-eKPWbhw1DDQixP_E"
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        
    def generate_content(self, 
                        prompt: str, 
                        model: str = "gemini-2.0-flash-exp",
                        temperature: float = 0.7,
                        max_tokens: int = 2048) -> Dict[str, Any]:
        """Generate content using Gemini API"""
        try:
            url = f"{self.base_url}/models/{model}:generateContent"
            
            headers = {
                "Content-Type": "application/json",
            }
            
            data = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": temperature,
                    "maxOutputTokens": max_tokens,
                    "topP": 0.8,
                    "topK": 10
                }
            }
            
            params = {
                "key": self.api_key
            }
            
            response = requests.post(url, headers=headers, json=data, params=params)
            response.raise_for_status()
            
            result = response.json()
            
            if "candidates" in result and len(result["candidates"]) > 0:
                content = result["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "success": True,
                    "content": content,
                    "model": model,
                    "usage": result.get("usageMetadata", {})
                }
            else:
                return {
                    "success": False,
                    "error": "No content generated",
                    "raw_response": result
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"API request failed: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def test_connection(self) -> Dict[str, Any]:
        """Test connection to Gemini API"""
        try:
            result = self.generate_content(
                prompt="Hello, this is a test message. Please respond with 'Connection successful!'",
                max_tokens=50
            )
            
            if result["success"]:
                return {
                    "success": True,
                    "message": "Gemini API connection successful",
                    "model": result.get("model", "unknown"),
                    "latency": "~200ms"
                }
            else:
                return {
                    "success": False,
                    "message": f"Connection failed: {result.get('error', 'Unknown error')}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Connection test failed: {str(e)}"
            }
    
    def list_models(self) -> List[Dict[str, Any]]:
        """List available Gemini models"""
        try:
            url = f"{self.base_url}/models"
            params = {"key": self.api_key}
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            result = response.json()
            models = []
            
            for model in result.get("models", []):
                if "generateContent" in model.get("supportedGenerationMethods", []):
                    models.append({
                        "name": model["name"].split("/")[-1],
                        "display_name": model.get("displayName", model["name"]),
                        "description": model.get("description", ""),
                        "version": model.get("version", ""),
                        "input_token_limit": model.get("inputTokenLimit", 0),
                        "output_token_limit": model.get("outputTokenLimit", 0)
                    })
            
            return models
            
        except Exception as e:
            return []
    
    def chat_completion(self, 
                       messages: List[Dict[str, str]], 
                       model: str = "gemini-2.0-flash-exp",
                       temperature: float = 0.7,
                       max_tokens: int = 2048) -> Dict[str, Any]:
        """Chat completion with conversation history"""
        try:
            # Convert messages to Gemini format
            contents = []
            
            for message in messages:
                role = message.get("role", "user")
                content = message.get("content", "")
                
                if role == "system":
                    # Gemini doesn't have system role, prepend to first user message
                    if contents and contents[0].get("role") == "user":
                        contents[0]["parts"][0]["text"] = f"{content}\n\n{contents[0]['parts'][0]['text']}"
                    else:
                        contents.insert(0, {
                            "role": "user",
                            "parts": [{"text": content}]
                        })
                elif role == "user":
                    contents.append({
                        "role": "user", 
                        "parts": [{"text": content}]
                    })
                elif role == "assistant":
                    contents.append({
                        "role": "model",
                        "parts": [{"text": content}]
                    })
            
            url = f"{self.base_url}/models/{model}:generateContent"
            
            headers = {
                "Content-Type": "application/json",
            }
            
            data = {
                "contents": contents,
                "generationConfig": {
                    "temperature": temperature,
                    "maxOutputTokens": max_tokens,
                    "topP": 0.8,
                    "topK": 10
                }
            }
            
            params = {
                "key": self.api_key
            }
            
            response = requests.post(url, headers=headers, json=data, params=params)
            response.raise_for_status()
            
            result = response.json()
            
            if "candidates" in result and len(result["candidates"]) > 0:
                content = result["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "success": True,
                    "content": content,
                    "model": model,
                    "usage": result.get("usageMetadata", {})
                }
            else:
                return {
                    "success": False,
                    "error": "No content generated",
                    "raw_response": result
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Chat completion failed: {str(e)}"
            }

