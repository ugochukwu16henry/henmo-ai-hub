'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
}

const models: Model[] = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most capable model', maxTokens: 8000 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and efficient', maxTokens: 4000 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Best reasoning', maxTokens: 200000 },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: 'Balanced performance', maxTokens: 200000 },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Multimodal capabilities', maxTokens: 32000 },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-48">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{currentModel.provider}</Badge>
              <span>{currentModel.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{model.provider}</Badge>
                  <span className="font-medium">{model.name}</span>
                </div>
                <span className="text-xs text-gray-500">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}