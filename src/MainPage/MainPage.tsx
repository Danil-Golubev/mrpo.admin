import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css'
import { Html5Qrcode } from 'html5-qrcode';
import {fetchScan } from '../api';
export const MainPage = () =>{
    const [decodedText, setDecodedText] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false); // Флаг для отслеживания состояния сканирования
    const [isScanned, setIsScanned] = useState(false);
    const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
    const qrCodeRegionId = "qr-reader"; // ID для div элемента

  
    const scanUser = async (text:string)=>{
      const obj = { tgId: decodedText[0], eventId:decodedText[1]  }
    const result = await fetchScan(obj)
    console.log(result)
    }
    


    

    useEffect(() => {
      // Очищаем сканер при размонтировании компонента
      return () => {
        stopScanner();
      };
    }, []);
  
    // Функция для запуска камеры и сканирования
    const startCamera = () => {
      if (isScanning) return;
  
      const config = {
        fps: 10, // Количество кадров в секунду
        qrbox: { width: 250, height: 250 }, // Область отображения
        aspectRatio: 1.0,
      };
  
      qrCodeScannerRef.current = new Html5Qrcode(qrCodeRegionId);
  
      qrCodeScannerRef.current.start(
        { facingMode: "environment" }, // Используем основную камеру
        config,
        (decodedText) => {
          setDecodedText(decodedText.split(','));
          setIsScanned(true); // Отображаем сообщение об успешном сканировании
          triggerVibration(); // Запускаем вибрацию
  scanUser(decodedText)
          stopScanner(); // Останавливаем сканер
        },
        (errorMessage) => {
          console.warn("Ошибка сканирования:", errorMessage);
        }
      ).then(() => {
        setIsScanning(true); // Устанавливаем флаг, что сканирование запущено
      }).catch((error) => {
        console.error("Не удалось запустить камеру:", error);
      });
    };
  
    // Функция для остановки и очистки сканера
    const stopScanner = () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.stop().then(() => {
          qrCodeScannerRef.current?.clear();
          setIsScanning(false); // Сбрасываем флаг сканирования
          qrCodeScannerRef.current = null; // Обнуляем реф, чтобы пересоздать сканер
        }).catch((error) => {
          console.error("Ошибка при остановке сканера:", error);
        });
      }
    };
  
    // Функция для запуска вибрации
    const triggerVibration = () => {
      if (navigator.vibrate) {
        navigator.vibrate(200); // Вибрация на 200 мс
      }
    };
  
    // Функция для повторного запуска сканера после успешного сканирования
    const handleRestart = () => {
      setDecodedText([]); // Сбрасываем информацию
      setIsScanned(false);  // Скрываем сообщение
      startCamera();        // Перезапускаем сканирование
    };
  
    return (
<div className={styles.main}>
      <div className={styles.qrScannerContainer}>
        {/* Кнопка для открытия камеры */}
        <button 
          className={styles.startButton} 
          onClick={isScanned ? handleRestart : startCamera} 
          disabled={isScanning}
        >
          {isScanned ? 'Сканировать снова' : 'Открыть камеру'}
        </button>
        {/* <button className={styles.startButton} onClick={()=>scanUser(decodedText )} >Тест</button> */}
  
        {/* Область для отображения камеры */}
        {!isScanned && <div id={qrCodeRegionId} className={styles.qrReader}></div>}
  
        {/* Сообщение об успешном сканировании */}
        {isScanned && (
          <div className={styles.resultContainer}>
            <h2 className={styles.successMessage}>Успешно просканировано!</h2>
            <p className={styles.resultText}>Usename: {decodedText}</p>
          </div>
        )}
      </div>
      </div>
    );
  };