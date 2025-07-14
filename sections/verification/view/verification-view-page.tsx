'use client';

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  CheckCircle,
  QrCode,
  Scan,
  User,
  XCircle,
  AlertTriangle,
  BarChart,
  HelpCircle,
  Home,
  Settings,
  Users,
  Vote,
  LoaderCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import PageContainer from '@/components/layout/page-container';
import { Html5Qrcode } from 'html5-qrcode';


type VerificationStep =
  | 'initial'
  | 'scanning'
  | 'ktm-photo'
  | 'selfie'
  | 'processing'
  | 'success'
  | 'failed';

type VerificationResult = {
  nim: string;
  name: string;
  faculty: string;
  faceMatchScore: number;
  isRegistered: boolean;
  success: boolean;
  message: string;
};

export default function VoterVerification() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('initial');
  const [progress, setProgress] = useState(0);
  const [scannedNIM, setScannedNIM] = useState('');
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const webcamRef = useRef<any>(null);
  const [isTakingSelfie, setIsTakingSelfie] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // set number for contact
  // Set number admin for customer service
  const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP;
  const message = encodeURIComponent(
    `Hi Admin, I need help regarding the verification process.`
  );
  const whatsappLink = `https://wa.me/${adminNumber}?text=${message}`;

  // state to scan QR code
  const [qrError, setQrError] = useState<string | null>(null);
  const [isQrScanning, setIsQrScanning] = useState(false);
  const qrCodeRegionId = 'qr-reader-region';

  // state to handle KTM photo and face match score
  const [ktmPhoto, setKtmPhoto] = useState<string | null>(null);
  // const [faceMatchScore, setFaceMatchScore] = useState<number | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [photoStep, setPhotoStep] = useState<'ktm' | 'selfie' | null>(null);

  // State untuk status user
  const [userStatus, setUserStatus] = useState<string>('loading');

  // // Fetch status user dari API
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const res = await fetch('/api/user/status');
        if (!res.ok) {
          setUserStatus('unauthenticated');
          return;
        }
        const data = await res.json();
        setUserStatus(data.status);
      } catch {
        setUserStatus('unauthenticated');
      }
    };
    fetchUserStatus();
  }, []);

  // Cek NIM ke backend
  const checkNim = async (nim: string) => {
    const res = await fetch('/api/verification/nim-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nim })
    });
    return await res.json();
  };

  // Handler untuk mulai scan QR
  const startQrScan = () => {
    setCurrentStep('scanning');
    setProgress(25);
    setIsQrScanning(true);
    setQrError(null);
  };

  // Handler untuk membuka webcam selfie
  // const handleSelfieCapture = () => {
  //   setIsTakingSelfie(true);
  // };

  const handleOpenWebcam = (step: 'ktm' | 'selfie') => {
    setIsTakingPhoto(true);
    setPhotoStep(step);
  };

  const handleTakePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (photoStep === 'ktm') {
        setKtmPhoto(imageSrc);
      } else if (photoStep === 'selfie') {
        setSelfieImage(imageSrc);
      }
      setIsTakingPhoto(false);
      setPhotoStep(null);
    }
  };

  // Handler untuk upload/crop foto KTM
  // const handleKtmPhotoCapture = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setKtmPhoto(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // Helper: AES encrypt base64 string (returns base64 ciphertext)
  async function encryptAES(
    plainText: string,
    keyHex: string,
    ivHex: string
  ): Promise<string> {
    const enc = new TextEncoder();
    const keyBytes = new Uint8Array(hexToBytes(keyHex));
    const ivBytes = new Uint8Array(hexToBytes(ivHex));
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyBytes as BufferSource,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivBytes as BufferSource },
      key,
      enc.encode(plainText)
    );
    // Avoid spread operator for Uint8Array for compatibility
    const uint8 = new Uint8Array(encrypted);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  }

  // Helper: hex string to Uint8Array
  function hexToBytes(hex: string): number[] {
    if (!hex) return [];
    const arr = [];
    for (let i = 0; i < hex.length; i += 2) {
      arr.push(parseInt(hex.slice(i, i + 2), 16));
    }
    return arr;
  }

  // Handler untuk post data verify face (encrypted)
  const verifyFace = async (ktmPhoto: string, selfieImage: string) => {
    // Kunci dan IV harus sama dengan backend (bisa dari env public, atau hardcode untuk demo/dev)
    const keyHex = process.env.NEXT_PUBLIC_FACE_ENCRYPT_KEY || '';
    const ivHex = process.env.NEXT_PUBLIC_FACE_ENCRYPT_IV || '';
    if (!keyHex || !ivHex) {
      throw new Error('Encryption key/iv not set');
    }
    const ktmPhotoEnc = await encryptAES(ktmPhoto, keyHex, ivHex);
    const selfieImageEnc = await encryptAES(selfieImage, keyHex, ivHex);
    const res = await fetch('/api/verification/face-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ktmPhotoEnc, selfieImageEnc })
    });
    return await res.json();
  };

  // Handler untuk submit dan face match (panggil API AWS Rekognition)
  const handleFaceMatch = async () => {
    setCurrentStep('processing');
    setProgress(75);

    try {
      // Cek NIM ke backend
      const voter = await checkNim(scannedNIM);
      if (!voter.isRegistered) {
        setVerificationResult({
          nim: scannedNIM,
          name: 'Unknown',
          faculty: 'Unknown',
          faceMatchScore: 0,
          isRegistered: false,
          success: false,
          message: 'Your NIM is not registered as a voter.'
        });
        setCurrentStep('failed');
        setProgress(100);
        return;
      }

      const result = await verifyFace(ktmPhoto!, selfieImage!);
      const score = result.similarity || 0;
      const isSuccess = result.success;

      setVerificationResult({
        nim: scannedNIM,
        name: voter.name,
        faculty: voter.faculty,
        faceMatchScore: score,
        isRegistered: true,
        success: isSuccess,
        message:
          result.message ||
          (isSuccess
            ? 'Verification successful! You are now eligible to vote.'
            : 'Face verification failed. Please try again.')
      });
      if (isSuccess) {
        // Update status user ke Verified di database
        await fetch('/api/verification/set-verified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nim: scannedNIM })
        });
      }
      setCurrentStep(isSuccess ? 'success' : 'failed');
      setProgress(100);
    } catch (error: any) {
      setVerificationResult({
        nim: scannedNIM,
        name: 'Unknown',
        faculty: 'Unknown',
        faceMatchScore: 0,
        isRegistered: true,
        success: false,
        message:
          'Face verification error: ' + (error?.message || 'Unknown error')
      });
      setCurrentStep('failed');
      setProgress(100);
    }
  };

  // Jalankan QR scanner saat step scanning
  useEffect(() => {
    if (currentStep === 'scanning' && isQrScanning) {
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            html5QrCode
              .start(
                { facingMode: 'environment' },
                {
                  fps: 20,
                  qrbox: { width: 320, height: 320 },
                  aspectRatio: 1.0
                },
                async (decodedText) => {
                  console.log('QR Code scanned:', decodedText);
                  // Validasi NIM dari QR
                  const nimMatch = decodedText.match(
                    /(L200(2[0-5])[0-9][0-9]{3})/
                  );
                  if (nimMatch) {
                    const nim = nimMatch[1];
                    // Ambil NIM dari email user yang login
                    try {
                      const res = await fetch('/api/user/status');
                      if (!res.ok) throw new Error('User not authenticated');
                      const data = await res.json();
                      // Email format: l200214201@student.ums.ac.id
                      const email: string = data.email || '';
                      const emailNimMatch = email.match(/(l\d{9})/i);
                      const emailNim = emailNimMatch
                        ? emailNimMatch[0].toUpperCase()
                        : '';

                      if (emailNim && nim.toUpperCase() === emailNim) {
                        setScannedNIM(nim);
                        setCurrentStep('ktm-photo');
                        setProgress(50);
                        setIsQrScanning(false);
                        html5QrCode.stop();
                        toast({
                          title: 'QR Code Scanned',
                          description: `Student ID: ${nim}`
                        });
                      } else {
                        html5QrCode.stop();
                        setQrError(
                          'NIM pada QR tidak cocok dengan NIM pada email login.'
                        );
                        toast({
                          title: 'NIM Tidak Cocok',
                          description:
                            'NIM pada QR tidak cocok dengan NIM pada email login Anda.',
                          variant: 'destructive'
                        });
                        setCurrentStep('initial');
                      }
                    } catch (err) {
                      html5QrCode.stop();
                      setQrError('Gagal memvalidasi NIM user login.');
                      toast({
                        title: 'Error',
                        description: 'Gagal memvalidasi NIM user login.',
                        variant: 'destructive'
                      });
                      setCurrentStep('initial');
                    }
                  } else {
                    html5QrCode.stop();
                    setQrError(
                      'QR code tidak valid atau tidak mengandung NIM.'
                    );
                    toast({
                      title: 'QR Code Error',
                      description:
                        'QR code tidak valid atau anda tidak terdaftar sebagai pemilih.',
                      variant: 'destructive'
                    });
                    setCurrentStep('initial');
                  }
                },
                (errorMessage) => {
                  // ignore scan errors
                  // console.warn('QR Code scan error:', errorMessage);
                }
              )
              .catch((err) => {
                setQrError('Tidak dapat mengakses kamera: ' + err);
              });
          } else {
            setQrError('Kamera tidak ditemukan.');
          }
        })
        .catch((err) => {
          setQrError('Tidak dapat mengakses kamera: ' + err);
        });
    }
  }, [currentStep, isQrScanning]);

  useEffect(() => {
    console.log('Current Step:', currentStep);
  }, [currentStep]);

  // const simulateQRScan = () => {
  //   setCurrentStep('scanning');
  //   setProgress(25);

  //   // Simulate QR code scanning delay
  //   setTimeout(() => {
  //     // Mock NIM extraction from QR code
  //     const mockNIMs = ['2021001234', '2021005678', '2021999999']; // Last one not registered
  //     const randomNIM = mockNIMs[Math.floor(Math.random() * mockNIMs.length)];

  //     setScannedNIM(randomNIM);
  //     setCurrentStep('selfie');
  //     setProgress(50);

  //     toast({
  //       title: 'QR Code Scanned',
  //       description: `Student ID: ${randomNIM}`
  //     });
  //   }, 2000);
  // };

  // const handleSelfieCapture = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setSelfieImage(e.target?.result as string);
  //       processVerification();
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const processVerification = () => {
  //   setCurrentStep('processing');
  //   setProgress(75);

  //   // Simulate verification process
  //   setTimeout(() => {
  //     const voter = registeredVoters.find((v) => v.nim === scannedNIM);
  //     const faceMatchScore = 100; // Mock face matching score

  //     const result: VerificationResult = {
  //       nim: scannedNIM,
  //       name: voter?.name || 'Unknown',
  //       faculty: voter?.faculty || 'Unknown',
  //       faceMatchScore: faceMatchScore,
  //       isRegistered: !!voter,
  //       success: !!voter && faceMatchScore > 95,
  //       message: ''
  //     };

  //     if (!voter) {
  //       result.message = 'Your NIM is not registered as a voter.';
  //       setCurrentStep('failed');
  //     } else if (faceMatchScore <= 95) {
  //       result.message = 'Face verification failed. Please try again.';
  //       setCurrentStep('failed');
  //     } else {
  //       result.message =
  //         'Verification successful! You are now eligible to vote.';
  //       setCurrentStep('success');
  //     }

  //     setVerificationResult(result);
  //     setProgress(100);
  //   }, 3000);
  // };

  const resetVerification = () => {
    setCurrentStep('initial');
    setProgress(0);
    setScannedNIM('');
    setSelfieImage(null);
    setVerificationResult(null);
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'initial':
        return 'Ready to start verification process';
      case 'scanning':
        return 'Scanning QR code to extract Student ID...';
      case 'selfie':
        return 'Please take a selfie for face verification';
      case 'processing':
        return 'Processing verification data...';
      case 'success':
        return 'Verification completed successfully';
      case 'failed':
        return 'Verification failed';
      default:
        return '';
    }
  };

  // ui loading status user
  if (userStatus === 'loading') {
    return (
      <PageContainer scrollable={true}>
        <main className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">
                  Voter Verification
                </CardTitle>
                <CardDescription className="text-center">
                  Verify your identity to ensure you are eligible to vote in the
                  upcoming elections
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Progress Bar Skeleton */}
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </div>

            {/* Verification Steps Skeleton */}
            <Card className="mb-6">
              <CardHeader>
                <Skeleton className="mb-2 h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full rounded" />
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="mx-auto h-10 w-1/2 rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Help Section Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="mb-2 h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="mt-4 h-8 w-1/3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </PageContainer>
    );
  }

  // user verified
  if (userStatus === 'Verified') {
    return (
      <PageContainer scrollable={true}>
        <main className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">
                  Voter Verification
                </CardTitle>
                <CardDescription className="text-center">
                  Verify your identity to ensure you are eligible to vote in the
                  upcoming elections
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{100}%</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="mt-2 text-sm text-gray-500">
                Verification completed successfully
              </p>
            </div>

            {/* Verification Steps */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Identity Verification
                </CardTitle>
                <CardDescription>
                  You have successfully verified your identity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Verification Successful</AlertTitle>
                    <AlertDescription>
                      You are now eligible to vote in the upcoming elections.
                    </AlertDescription>
                  </Alert>
                  <div className="text-center">
                    <Button asChild size="lg">
                      <Link href="/dashboard/vote">
                        <Vote className="mr-2 h-5 w-5" />
                        Proceed to Vote
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Voter Verification
              </CardTitle>
              <CardDescription className="text-center">
                Verify your identity to ensure you are eligible to vote in the
                upcoming elections
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-sm text-gray-500">{getStepDescription()}</p>
          </div>

          {/* Verification Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Identity Verification
              </CardTitle>
              <CardDescription>
                Complete the following steps to verify your voter eligibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: QR Code Scanning */}
              {currentStep === 'initial' && (
                <div className="space-y-4 text-center">
                  <div className="rounded-lg bg-blue-50 p-8 dark:bg-blue-950">
                    <QrCode className="mx-auto mb-4 h-16 w-16 text-blue-600 dark:text-blue-400" />
                    <h3 className="mb-2 text-lg font-semibold dark:text-white">
                      Step 1: Scan Student ID QR Code
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Scan the QR code on your Student ID Card to extract your
                      NIM
                    </p>
                    <Button onClick={startQrScan} size="lg">
                      <Scan className="mr-2 h-5 w-5" />
                      Start QR Scan
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: QR Scanning in Progress */}
              {currentStep === 'scanning' && (
                <div className="space-y-4 text-center">
                  <div className="rounded-lg bg-blue-50 p-8 dark:bg-blue-950">
                    <h3 className="mb-2 text-lg font-semibold dark:text-white">
                      Scan Student ID QR Code
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Please point your Student ID QR code to your webcam. The
                      system will automatically scanning.
                    </p>
                    <div
                      id={qrCodeRegionId}
                      className="mx-auto"
                      style={{
                        width: 280,
                        height: 280,
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}
                    />
                    {qrError && (
                      <p className="mt-2 text-sm text-red-500">{qrError}</p>
                    )}
                    <Button
                      onClick={() => {
                        setCurrentStep('initial');
                        setIsQrScanning(false);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3a: KTM Capture */}
              {currentStep === 'ktm-photo' && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>QR Code Scanned Successfully</AlertTitle>
                    <AlertDescription>
                      Student ID: <strong>{scannedNIM}</strong>
                    </AlertDescription>
                  </Alert>
                  <div className="text-center">
                    <div className="rounded-lg bg-green-50 p-8 dark:bg-green-950">
                      <Camera className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
                      <h3 className="mb-2 text-lg font-semibold dark:text-white">
                        Step 2: Take a Clear Photo of Your Student ID
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Take a clear photo of your ID using your webcam. Make
                        sure the photo and your NIM are visible.
                      </p>
                      {!ktmPhoto && !isTakingPhoto && (
                        <Button
                          onClick={() => handleOpenWebcam('ktm')}
                          size="lg"
                        >
                          <Camera className="mr-2 h-5 w-5" />
                          Open Webcam
                        </Button>
                      )}
                      {isTakingPhoto && photoStep === 'ktm' && (
                        <div className="flex flex-col items-center gap-4">
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={320}
                            height={240}
                            videoConstraints={{ facingMode: 'user' }}
                            className="rounded-lg border"
                          />
                          <Button onClick={handleTakePhoto} size="lg">
                            <Camera className="mr-2 h-5 w-5" />
                            Capture KTM Photo
                          </Button>
                          <Button
                            onClick={() => {
                              setIsTakingPhoto(false);
                              setPhotoStep(null);
                            }}
                            variant="destructive"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      {ktmPhoto && (
                        <div className="mt-4">
                          <Image
                            src={ktmPhoto}
                            alt="KTM Photo"
                            width={220}
                            height={140}
                            className="mx-auto rounded-lg"
                          />
                        </div>
                      )}
                      {ktmPhoto && (
                        <Button
                          onClick={() => setCurrentStep('selfie')}
                          size="lg"
                          className="mt-6"
                        >
                          Next: Take Selfie
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3b: Selfie Capture */}
              {currentStep === 'selfie' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="rounded-lg bg-green-50 p-8 dark:bg-green-950">
                      <Camera className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
                      <h3 className="mb-2 text-lg font-semibold dark:text-white">
                        Step 3: Take a Selfie (Face Only)
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Take a selfie with your face clearly visible (no Student
                        ID in this photo).
                      </p>
                      {!selfieImage && !isTakingPhoto && (
                        <Button
                          onClick={() => handleOpenWebcam('selfie')}
                          size="lg"
                        >
                          <Camera className="mr-2 h-5 w-5" />
                          Open Webcam
                        </Button>
                      )}
                      {isTakingPhoto && photoStep === 'selfie' && (
                        <div className="flex flex-col items-center gap-4">
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={320}
                            height={240}
                            videoConstraints={{ facingMode: 'user' }}
                            className="rounded-lg border"
                          />
                          <Button onClick={handleTakePhoto} size="lg">
                            <Camera className="mr-2 h-5 w-5" />
                            Capture Selfie
                          </Button>
                          <Button
                            onClick={() => {
                              setIsTakingPhoto(false);
                              setPhotoStep(null);
                            }}
                            variant="destructive"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      {selfieImage && (
                        <div className="mt-4">
                          <Image
                            src={selfieImage}
                            alt="Selfie"
                            width={180}
                            height={180}
                            className="mx-auto rounded-lg"
                          />
                        </div>
                      )}
                      {ktmPhoto && selfieImage && (
                        <Button
                          onClick={handleFaceMatch}
                          size="lg"
                          className="mt-6"
                        >
                          Submit for Face Verification
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Processing */}
              {currentStep === 'processing' && (
                <div className="space-y-4">
                  {/* {selfieImage && (
                    <div className="text-center">
                      <Image
                        src={selfieImage || '/placeholder.svg'}
                        alt="Selfie"
                        width={150}
                        height={150}
                        className="mx-auto rounded-full border-4 border-blue-200"
                      />
                    </div>
                  )} */}
                  <div className="text-center">
                    <div className="rounded-lg bg-yellow-50 p-8 dark:bg-yellow-950">
                      <div className="animate-spin">
                        <LoaderCircle className="mx-auto mb-4 h-16 w-16 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold dark:text-white">
                        Processing Verification...
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Validating your identity and checking voter registration
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Success Result */}
              {currentStep === 'success' && verificationResult && (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-400">
                      Verification Successful!
                    </AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      {verificationResult.message}
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 font-semibold dark:text-white">
                      Verification Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="dark:text-gray-300">
                          Student ID (NIM):
                        </span>
                        <span className="font-medium dark:text-white">
                          {verificationResult.nim}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-300">Name:</span>
                        <span className="font-medium dark:text-white">
                          {verificationResult.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-300">Faculty:</span>
                        <span className="font-medium dark:text-white">
                          {verificationResult.faculty}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-300">
                          Face Match Score:
                        </span>
                        <Badge
                          variant="secondary"
                          className="dark:bg-gray-700 dark:text-gray-200"
                        >
                          {verificationResult.faceMatchScore.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          Registered
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button asChild size="lg">
                      <Link href="/dashboard/vote">
                        <Vote className="mr-2 h-5 w-5" />
                        Proceed to Vote
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Failed Result */}
              {currentStep === 'failed' && verificationResult && (
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-950">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800 dark:text-red-400">
                      Verification Failed
                    </AlertTitle>
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {verificationResult.message}
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 font-semibold dark:text-white">
                      Verification Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="dark:text-gray-300">
                          Student ID (NIM):
                        </span>
                        <span className="font-medium dark:text-white">
                          {verificationResult.nim}
                        </span>
                      </div>
                      {verificationResult.isRegistered ? (
                        <>
                          <div className="flex justify-between">
                            <span className="dark:text-gray-300">
                              Registration Status:
                            </span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Registered
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="dark:text-gray-300">
                              Face Match Score:
                            </span>
                            <Badge
                              variant="destructive"
                              className="dark:bg-red-900 dark:text-red-200"
                            >
                              {verificationResult.faceMatchScore.toFixed(1)}%
                            </Badge>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="dark:text-gray-300">
                            Registration Status:
                          </span>
                          <Badge
                            variant="destructive"
                            className="dark:bg-red-900 dark:text-red-200"
                          >
                            Not Registered
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-center">
                    <Button onClick={resetVerification} variant="default">
                      Try Again
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      If you continue to have issues, please contact support
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm dark:text-gray-300">
                <p>• Make sure your Student ID QR code is clearly visible</p>
                <p>• Ensure good lighting when taking your selfie</p>
                <p>
                  • Your face should be clearly visible and match your ID photo
                </p>
                <p>• Contact support if you encounter technical issues</p>
              </div>
              <Button variant="outline" className="mt-4" asChild>
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageContainer>
  );
}
