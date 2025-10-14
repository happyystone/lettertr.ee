import { Button } from '@/common/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { Settings, Type, AlignLeft, Monitor, Eye } from 'lucide-react';

interface ReadingSettingsProps {
  settings: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    lineHeight: 'compact' | 'normal' | 'relaxed';
    width: 'narrow' | 'normal' | 'wide';
    focusMode: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export function ReadingSettings({ settings, onSettingsChange }: ReadingSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">설정</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold">읽기 설정</h3>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Type className="h-4 w-4" />
              글꼴 크기
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                <Button
                  key={size}
                  variant={settings.fontSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSettingsChange({ ...settings, fontSize: size })}
                  className="text-xs"
                >
                  {size === 'small' && '작게'}
                  {size === 'medium' && '보통'}
                  {size === 'large' && '크게'}
                  {size === 'extra-large' && '매우 크게'}
                </Button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <AlignLeft className="h-4 w-4" />줄 간격
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['compact', 'normal', 'relaxed'] as const).map((height) => (
                <Button
                  key={height}
                  variant={settings.lineHeight === height ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSettingsChange({ ...settings, lineHeight: height })}
                  className="text-xs"
                >
                  {height === 'compact' && '좁게'}
                  {height === 'normal' && '보통'}
                  {height === 'relaxed' && '넓게'}
                </Button>
              ))}
            </div>
          </div>

          {/* Width */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              너비
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['narrow', 'normal', 'wide'] as const).map((width) => (
                <Button
                  key={width}
                  variant={settings.width === width ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSettingsChange({ ...settings, width })}
                  className="text-xs"
                >
                  {width === 'narrow' && '좁게'}
                  {width === 'normal' && '보통'}
                  {width === 'wide' && '넓게'}
                </Button>
              ))}
            </div>
          </div>

          {/* Focus Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              집중 모드
            </label>
            <Button
              variant={settings.focusMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSettingsChange({ ...settings, focusMode: !settings.focusMode })}
              className="w-full text-xs"
            >
              {settings.focusMode ? '켜짐' : '꺼짐'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
