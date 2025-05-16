// src/components/sound/MusicVisualizer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 可视化样式类型
export type VisualizerStyle = 
  | 'bars'       // 频谱柱状图
  | 'wave'       // 波形图
  | 'circle'     // 圆形频谱
  | 'particles'  // 粒子效果
  | 'bamboo';    // 竹子风格

// 可视化器属性
export interface MusicVisualizerProps {
  // 是否激活
  active: boolean;
  // 音频元素或音频URL
  audio?: HTMLAudioElement | string;
  // 可视化样式
  style?: VisualizerStyle;
  // 颜色主题
  colorTheme?: 'jade' | 'gold' | 'blue' | 'purple' | 'rainbow';
  // 是否显示背景
  showBackground?: boolean;
  // 灵敏度 (0.0-5.0)
  sensitivity?: number;
  // 平滑度 (0.0-1.0)
  smoothing?: number;
  // 自定义类名
  className?: string;
  // 宽度
  width?: number | string;
  // 高度
  height?: number | string;
  // 是否响应式
  responsive?: boolean;
}

/**
 * 音乐可视化组件
 * 
 * 用于可视化音乐的频谱和波形
 */
const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  active,
  audio,
  style = 'bars',
  colorTheme = 'jade',
  showBackground = true,
  sensitivity = 1.0,
  smoothing = 0.8,
  className = '',
  width = '100%',
  height = 120,
  responsive = true
}) => {
  // 引用
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // 状态
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<VisualizerStyle>(style);
  
  // 初始化音频上下文和分析器
  useEffect(() => {
    if (!active) return;
    
    try {
      // 创建音频上下文
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        throw new Error('Web Audio API is not supported in this browser');
      }
      
      audioContextRef.current = new AudioContext();
      
      // 创建分析器
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256; // 必须是2的幂
      analyser.smoothingTimeConstant = smoothing;
      analyserRef.current = analyser;
      
      // 如果提供了音频元素或URL，连接到分析器
      if (audio) {
        connectAudio(audio);
      }
      
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize audio visualizer:', err);
      setError(`Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    // 清理函数
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [active]);
  
  // 当音频、样式或灵敏度变化时更新
  useEffect(() => {
    if (!active || !isInitialized) return;
    
    // 更新分析器平滑度
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
    
    // 如果音频变化，重新连接
    if (audio && (!audioElementRef.current || 
        (typeof audio !== 'string' && audio !== audioElementRef.current))) {
      connectAudio(audio);
    }
    
    // 更新可视化样式
    setCurrentStyle(style);
    
    // 开始渲染
    startVisualization();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, audio, style, sensitivity, smoothing, isInitialized]);
  
  // 连接音频到分析器
  const connectAudio = (audioSource: HTMLAudioElement | string) => {
    if (!audioContextRef.current || !analyserRef.current) return;
    
    try {
      // 断开现有连接
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      // 如果是字符串URL，创建新的音频元素
      if (typeof audioSource === 'string') {
        const audioElement = new Audio(audioSource);
        audioElement.crossOrigin = 'anonymous';
        audioElement.loop = true;
        audioElementRef.current = audioElement;
        
        // 加载并播放
        audioElement.load();
        audioElement.play().catch(err => {
          console.warn('Failed to play audio:', err);
        });
      } else {
        // 使用提供的音频元素
        audioElementRef.current = audioSource;
      }
      
      // 创建媒体源并连接到分析器
      const source = audioContextRef.current.createMediaElementSource(audioElementRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      sourceRef.current = source;
    } catch (err) {
      console.error('Failed to connect audio:', err);
      setError(`Failed to connect audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  // 开始可视化
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布尺寸
    if (responsive) {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    } else {
      canvas.width = typeof width === 'number' ? width : canvas.clientWidth;
      canvas.height = typeof height === 'number' ? height : canvas.clientHeight;
    }
    
    // 创建数据数组
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // 渲染函数
    const render = () => {
      if (!analyserRef.current || !ctx) return;
      
      // 请求下一帧
      animationFrameRef.current = requestAnimationFrame(render);
      
      // 获取频谱数据
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制背景
      if (showBackground) {
        ctx.fillStyle = 'rgba(245, 245, 245, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // 根据样式渲染可视化效果
      switch (currentStyle) {
        case 'bars':
          renderBars(ctx, dataArray, bufferLength, canvas.width, canvas.height);
          break;
        case 'wave':
          renderWave(ctx, dataArray, bufferLength, canvas.width, canvas.height);
          break;
        case 'circle':
          renderCircle(ctx, dataArray, bufferLength, canvas.width, canvas.height);
          break;
        case 'particles':
          renderParticles(ctx, dataArray, bufferLength, canvas.width, canvas.height);
          break;
        case 'bamboo':
          renderBamboo(ctx, dataArray, bufferLength, canvas.width, canvas.height);
          break;
        default:
          renderBars(ctx, dataArray, bufferLength, canvas.width, canvas.height);
      }
    };
    
    // 开始渲染
    render();
    
    // 清理函数
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (responsive) {
        window.removeEventListener('resize', resizeCanvas);
      }
    };
  };
  
  // 调整画布大小
  const resizeCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };
  
  // 获取颜色
  const getColor = (value: number, index: number, total: number) => {
    const normalizedValue = value / 255;
    const position = index / total;
    
    switch (colorTheme) {
      case 'jade':
        return `rgb(${Math.round(50 + 100 * normalizedValue)}, ${Math.round(150 + 105 * normalizedValue)}, ${Math.round(100 + 50 * normalizedValue)})`;
      case 'gold':
        return `rgb(${Math.round(200 + 55 * normalizedValue)}, ${Math.round(150 + 50 * normalizedValue)}, ${Math.round(50 + 50 * normalizedValue)})`;
      case 'blue':
        return `rgb(${Math.round(50 + 50 * normalizedValue)}, ${Math.round(100 + 100 * normalizedValue)}, ${Math.round(200 + 55 * normalizedValue)})`;
      case 'purple':
        return `rgb(${Math.round(150 + 50 * normalizedValue)}, ${Math.round(50 + 50 * normalizedValue)}, ${Math.round(200 + 55 * normalizedValue)})`;
      case 'rainbow':
        const hue = (position * 360) % 360;
        return `hsl(${hue}, ${70 + 30 * normalizedValue}%, ${40 + 30 * normalizedValue}%)`;
      default:
        return `rgb(${Math.round(50 + 100 * normalizedValue)}, ${Math.round(150 + 105 * normalizedValue)}, ${Math.round(100 + 50 * normalizedValue)})`;
    }
  };
  
  // 渲染柱状图
  const renderBars = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    width: number,
    height: number
  ) => {
    const barWidth = width / bufferLength * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height * sensitivity;
      
      ctx.fillStyle = getColor(dataArray[i], i, bufferLength);
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };
  
  // 渲染波形图
  const renderWave = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    width: number,
    height: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    const sliceWidth = width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const v = (dataArray[i] / 128.0) * sensitivity;
      const y = (v * height) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = getColor(200, bufferLength / 2, bufferLength);
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  
  // 渲染圆形频谱
  const renderCircle = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = getColor(100, 0, bufferLength);
    ctx.fill();
    
    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i] * sensitivity;
      const barHeight = (value / 255) * (radius * 0.8);
      
      const angle = (i * 2 * Math.PI) / bufferLength;
      const x1 = centerX + Math.cos(angle) * radius * 0.2;
      const y1 = centerY + Math.sin(angle) * radius * 0.2;
      const x2 = centerX + Math.cos(angle) * (radius * 0.2 + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius * 0.2 + barHeight);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = getColor(value, i, bufferLength);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };
  
  // 渲染粒子效果
  const renderParticles = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    width: number,
    height: number
  ) => {
    const particleCount = 50;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 计算平均音量
    let avgVolume = 0;
    for (let i = 0; i < bufferLength; i++) {
      avgVolume += dataArray[i];
    }
    avgVolume = (avgVolume / bufferLength) * sensitivity;
    
    // 绘制粒子
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 2 * Math.PI;
      const radius = (avgVolume / 255) * Math.min(width, height) * 0.4;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const particleSize = (avgVolume / 255) * 10 + 2;
      
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, 2 * Math.PI);
      ctx.fillStyle = getColor(avgVolume, i, particleCount);
      ctx.fill();
    }
  };
  
  // 渲染竹子风格
  const renderBamboo = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number,
    width: number,
    height: number
  ) => {
    const bambooCount = Math.min(bufferLength, 20);
    const bambooWidth = width / bambooCount;
    const bambooGap = bambooWidth * 0.2;
    
    for (let i = 0; i < bambooCount; i++) {
      const value = dataArray[i * Math.floor(bufferLength / bambooCount)];
      const bambooHeight = (value / 255) * height * sensitivity;
      
      // 绘制竹子主体
      const x = i * bambooWidth;
      ctx.fillStyle = getColor(value, i, bambooCount);
      ctx.fillRect(x + bambooGap, height - bambooHeight, bambooWidth - bambooGap * 2, bambooHeight);
      
      // 绘制竹节
      const segmentCount = Math.floor(bambooHeight / 20) + 1;
      for (let j = 0; j < segmentCount; j++) {
        const segmentY = height - j * 20;
        if (segmentY > height - bambooHeight) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(x + bambooGap, segmentY - 2, bambooWidth - bambooGap * 2, 4);
        }
      }
    }
  };
  
  return (
    <div 
      className={`music-visualizer ${className}`}
      style={{ 
        width: width, 
        height: height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px'
      }}
    >
      <AnimatePresence>
        {active && (
          <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        )}
      </AnimatePresence>
      
      {error && (
        <div className="visualizer-error" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: '#e53e3e',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default MusicVisualizer;
