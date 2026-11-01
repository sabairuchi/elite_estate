import { useState, useEffect, useRef } from 'react';
import { RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

interface CaptchaChallengeProps {
  onVerify: (isValid: boolean) => void;
  required?: boolean;
}

export default function CaptchaChallenge({ onVerify }: CaptchaChallengeProps) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 5-character alphanumeric string (excluding confusing characters like 0/O, 1/I)
  const generateRandomCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Draw captcha with background distortion, random angles, and noise lines
  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Background gradient (Luxury navy & slate tones)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0E1B2F');
    gradient.addColorStop(1, '#1A2E4C');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw random background grid & noise lines
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(197, 163, 92, ${0.15 + Math.random() * 0.25})`; // Gold noise lines
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // Draw random noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with distinct rotations and colors
    const charSpacing = width / (code.length + 1);
    ctx.textBaseline = 'middle';

    const colors = ['#C5A35C', '#DEC38B', '#FFFFFF', '#E2E8F0', '#FCD34D'];

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = (i + 0.8) * charSpacing;
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.font = `bold ${Math.floor(height * 0.52)}px 'Poppins', sans-serif`;
      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(char, -10, 0);
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateRandomCode();
    setCaptchaCode(newCode);
    setUserInput('');
    setStatus('idle');
    onVerify(false);
    setTimeout(() => drawCaptcha(newCode), 20);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    if (val.trim().toLowerCase() === captchaCode.toLowerCase()) {
      setStatus('success');
      onVerify(true);
    } else {
      if (val.length >= captchaCode.length) {
        setStatus('error');
      } else {
        setStatus('idle');
      }
      onVerify(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-200">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Security Verification
        </label>
        <span className="text-[11px] text-slate-400 font-medium">Type the characters shown</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Canvas Visual Display */}
        <div className="relative overflow-hidden rounded-lg border border-slate-300 shadow-inner shrink-0 bg-primary h-11 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={160}
            height={44}
            className="block cursor-pointer select-none"
            onClick={refreshCaptcha}
            title="Click to get a new code"
          />
          <button
            type="button"
            onClick={refreshCaptcha}
            className="absolute right-1 top-1 bottom-1 px-1.5 flex items-center justify-center text-slate-300 hover:text-accent bg-primary/80 hover:bg-primary rounded transition-colors"
            title="Refresh code"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="relative flex-grow">
          <input
            type="text"
            required
            maxLength={6}
            placeholder="Enter security code"
            value={userInput}
            onChange={handleInputChange}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm font-semibold tracking-wider uppercase transition-all outline-none ${
              status === 'success'
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 focus:ring-1 focus:ring-emerald-500'
                : status === 'error'
                ? 'border-red-400 bg-red-50/50 text-red-800 focus:ring-1 focus:ring-red-400'
                : 'border-slate-200 bg-white text-slate-800 focus:border-accent focus:ring-1 focus:ring-accent'
            }`}
          />
          {status === 'success' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Verified
            </span>
          )}
          {status === 'error' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs font-semibold flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> Incorrect
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
