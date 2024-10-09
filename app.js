// 引入 QRScanner
import QRScanner from './qr-scanner.min.js';
QRScanner.WORKER_PATH = './qr-scanner-worker.min.js';

document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadImage');
    const fileInput = document.getElementById('fileInput');
    const openCameraButton = document.getElementById('openCamera');
    const video = document.getElementById('video');
    const resultDiv = document.getElementById('result');

    // 上传图片识别二维码
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const img = await createImageBitmap(file);
            QRScanner.scanImage(img)
                .then(result => {
                    displayResult(result);
                })
                .catch(err => {
                    alert("No QR code found.");
                });
        }
    });

    // 打开摄像头并扫描二维码
    openCameraButton.addEventListener('click', () => {
        video.style.display = 'block';
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then((stream) => {
                video.srcObject = stream;
                const qrScanner = new QRScanner(video, result => {
                    displayResult(result);
                    qrScanner.stop(); // 停止扫描
                    stream.getTracks().forEach(track => track.stop()); // 停止摄像头
                });
                qrScanner.start();
            })
            .catch(err => {
                console.error("Could not open camera:", err);
            });
    });

    // 显示并复制识别结果
    function displayResult(result) {
        resultDiv.textContent = `QR Code: ${result}`;
        navigator.clipboard.writeText(result).then(() => {
            alert("QR code copied to clipboard.");
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }
});
