import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Globe, CheckCircle } from 'lucide-react';
import { exchangeStore } from '@/lib/exchangeStore';

export default function ExchangeConfirm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [fromAmount, setFromAmount] = useState('22000');
  const [toAmount, setToAmount] = useState('46.01');

  useEffect(() => {
    const exchangeData = exchangeStore.getExchangeData();
    if (exchangeData) {
      setFromAmount(exchangeData.fromAmount);
      setToAmount(exchangeData.toAmount);
      if (exchangeData.email) setEmail(exchangeData.email);
      if (exchangeData.walletAddress) setWalletAddress(exchangeData.walletAddress);
    } else {
      // Redirect to homepage if no exchange data
      navigate('/');
    }
  }, [navigate]);

  const handleConfirm = () => {
    exchangeStore.updateExchangeData({
      email,
      walletAddress
    });
    navigate('/payment');
  };

  return (
    <div className="min-h-screen crypto-gradient">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-semibold text-foreground">ALMASU</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-foreground">
                <Globe className="w-4 h-4 mr-2" />
                RU
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Link>

          {/* Exchange Confirmation */}
          <div className="card-gradient rounded-2xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
              Подтверждение обмена
            </h1>

            {/* Exchange Details */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div>
                  <div className="text-sm text-muted-foreground">Отдаете</div>
                  <div className="text-2xl font-bold text-foreground">{fromAmount} KZT</div>
                </div>
                <ArrowRight className="w-6 h-6 text-primary mx-4" />
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Получаете</div>
                  <div className="text-2xl font-bold text-foreground">{toAmount} USDT</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Курс обмена:</span>
                  <span className="text-foreground">478.50 ₸</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Комиссия:</span>
                  <span className="text-foreground">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Время обработки:</span>
                  <span className="text-foreground">5-15 мин</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус:</span>
                  <span className="text-green-400">Активен</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-foreground">Контактная информация</h3>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Email адрес</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border text-foreground"
                  placeholder="example@mail.com"
                  type="email"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Кошелек USDT (TRC20) <span className="text-red-400">*</span>
                </label>
                <Input
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className={`bg-input border-border text-foreground ${
                    walletAddress.length === 0 ? 'border-red-400/50' : ''
                  }`}
                  placeholder="TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
                  required
                />
                {walletAddress.length === 0 && (
                  <p className="text-red-400 text-xs mt-1">Поле обязательно для заполнения</p>
                )}
              </div>
            </div>

            {/* Agreement */}
            <div className="flex items-start space-x-3 mb-8">
              <input type="checkbox" className="mt-1" id="agreement" />
              <label htmlFor="agreement" className="text-sm text-muted-foreground leading-relaxed">
                Я согласен с условиями использования и политикой конфиденциальности
              </label>
            </div>

            {/* Confirm Button */}
            {walletAddress.trim() ? (
              <Link
                to={`/payment?from=${fromAmount}&to=${toAmount}&email=${email}&wallet=${walletAddress}`}
                className="block"
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 text-lg">
                  Подтвердить обмен
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                className="w-full bg-muted text-muted-foreground font-medium py-4 text-lg cursor-not-allowed"
              >
                Подтвердить обмен
              </Button>
            )}
          </div>

          {/* Security Notice */}
          <div className="card-gradient rounded-xl p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Безопасная сделка</h3>
            <p className="text-muted-foreground text-sm">
              Все операции ��ащищены банковским шифрованием. 
              Ваши данные в полной безопасности.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
