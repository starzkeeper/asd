import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Globe, CreditCard, Shield, Clock } from 'lucide-react';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const fromAmount = searchParams.get('from') || '1000';
  const toAmount = searchParams.get('to') || '2.09';
  const email = searchParams.get('email') || '';
  




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
          <Link to="/exchange-confirm" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к подтверждению
          </Link>

          {/* Payment Form */}
          <div className="card-gradient rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center mb-8">
              <CreditCard className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-foreground">Оплата</h1>
            </div>

            {/* Order Summary */}
            <div className="bg-background/50 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">К оплате:</span>
                <span className="text-2xl font-bold text-foreground">{fromAmount} ₸</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Получите:</span>
                <span className="text-foreground">{toAmount} USDT</span>
              </div>
            </div>

            {/* Transfer Instructions */}
            <div className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                  Переведите средства на карту
                </h3>

                <div className="bg-background/50 rounded-xl p-4 mb-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-foreground tracking-wider">
                      4003035115685047
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">Номер карты для перевода</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Получатель:</span>
                      <div className="text-foreground font-medium">Sadykov Bekzat</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Банк:</span>
                      <div className="text-foreground font-medium">Halyk Bank</div>
                    </div>
                  </div>
                </div>

                <div className="bg-background/30 rounded-lg p-4">
                  <h4 className="text-foreground font-medium mb-3">Инструкция по переводу:</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Откройте мобильное приложение вашего банка</li>
                    <li>Выберите "Перевод на карту"</li>
                    <li>Введите номер карты: <span className="text-foreground font-mono">4276 3800 1234 5678</span></li>
                    <li>Укажите сумму: <span className="text-foreground font-semibold">{fromAmount} ₸</span></li>
                    <li>Подтвердите перевод</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Payment Security */}
            <div className="bg-background/30 rounded-xl p-4 my-8">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-foreground font-medium">Безопасная оплата</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SSL шифрование</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>PCI DSS сертификация</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>3D Secure защита</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Данные не сох��аняются</span>
                </div>
              </div>
            </div>

            {/* Payment Processing Time */}
            <div className="flex items-center justify-center space-x-2 text-muted-foreground text-sm mb-8">
              <Clock className="w-4 h-4" />
              <span>Обработка платежа: 1-3 минуты</span>
            </div>

            {/* Pay Button */}
            <Link 
              to={`/transaction-status?from=${fromAmount}&to=${toAmount}&email=${email}`}
              className="block"
            >
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 text-lg">
              Я перевел {fromAmount} ₸
            </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">
              Возникли проблемы с оплатой?
            </p>
            <a href="#" className="text-primary hover:underline text-sm">
              Связаться с поддержкой
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
