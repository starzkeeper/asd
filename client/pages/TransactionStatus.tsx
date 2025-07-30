import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Globe, Copy, Download, ArrowRight } from 'lucide-react';
import { exchangeStore } from '@/lib/exchangeStore';
import { Logo } from '@/components/ui/logo';

export default function TransactionStatus() {
  const navigate = useNavigate();
  const [fromAmount, setFromAmount] = useState('22000');
  const [toAmount, setToAmount] = useState('46.01');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'processing' | 'completed'>('processing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const exchangeData = exchangeStore.getExchangeData();
    if (exchangeData) {
      setFromAmount(exchangeData.fromAmount);
      setToAmount(exchangeData.toAmount);
      setEmail(exchangeData.email || '');
    } else {
      // Redirect to homepage if no exchange data
      navigate('/');
    }
  }, [navigate]);
  
  // Simulate transaction processing
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setStatus('completed');
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const transactionId = "TX" + Date.now().toString().slice(-8);
  const walletAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen crypto-gradient">
        {/* Header */}
        <header className="relative z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <Logo size="lg" />
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                    ALMASU
                  </span>
                  <div className="text-xs text-muted-foreground">Обменник криптовалюты</div>
                </div>
              </Link>

              <div className="modern-card px-3 py-2 rounded-full">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-foreground">Онлайн</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="exchange-card rounded-3xl p-8 text-center">
              <div className="flex items-center justify-center mb-8">
                <Clock className="w-16 h-16 text-primary animate-spin" />
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                Обработка транзакции
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Ваш платеж обрабатывается. Пожалуйста, не закрывайте эту страницу.
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-background/30 rounded-full h-3 mb-8">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="text-sm text-muted-foreground">
                Прогресс: {progress}%
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen crypto-gradient">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <Logo size="lg" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                  ALMASU
                </span>
                <div className="text-xs text-muted-foreground">Обменник криптовалюты</div>
              </div>
            </Link>

            <div className="modern-card px-3 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-foreground">Онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Status */}
          <div className="exchange-card rounded-3xl p-8 mb-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Транзакция завершена!
              </h1>
              <p className="text-muted-foreground">
                Ваш обмен успешно выполнен
              </p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div>
                  <div className="text-sm text-muted-foreground">Отдали</div>
                  <div className="text-xl font-bold text-foreground">{fromAmount} KZT</div>
                </div>
                <ArrowRight className="w-6 h-6 text-primary" />
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Получили</div>
                  <div className="text-xl font-bold text-green-400">{toAmount} USDT</div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                  <span className="text-muted-foreground">ID транзакции:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground font-mono">{transactionId}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => copyToClipboard(transactionId)}
                      className="p-1 h-auto"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                  <span className="text-muted-foreground">Дата и время:</span>
                  <span className="text-foreground">{new Date().toLocaleString('ru-RU')}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                  <span className="text-muted-foreground">Курс обмена:</span>
                  <span className="text-foreground">478.50 ₸</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                  <span className="text-muted-foreground">Статус:</span>
                  <span className="text-green-400 font-medium">Завершено</span>
                </div>
              </div>

              {/* USDT Wallet Address */}
              <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-medium">USDT отправлены на ваш кошелек:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-foreground bg-background/50 p-2 rounded text-sm font-mono break-all">
                    {walletAddress}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => copyToClipboard(walletAddress)}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Email Confirmation */}
              {email && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-primary">
                    📧 Подтверждение отправлено на <strong>{email}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8">
            <Link to="/">
              <Button className="w-full h-12 bg-primary hover:bg-primary/90">
                Новый обмен
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="modern-card rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Нужна помощь?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Наша служба поддержки работает 24/7 и готова помочь вам в любое время
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/Serik_Maksat" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Связаться с поддержкой
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
