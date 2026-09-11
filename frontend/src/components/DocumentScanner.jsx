import React, { useState, useRef, useEffect } from 'react';
import { FileText, Camera, Upload, CheckCircle, X, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export default function DocumentScanner({
  documentFile,
  setDocumentFile,
  livePhotoFile,
  setLivePhotoFile,
  onScan,
  isScanning
}) {
  const [docPreview, setDocPreview] = useState(null);
  const [livePreview, setLivePreview] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      setDocPreview(URL.createObjectURL(file));
    }
  };

  const handleLiveChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLivePhotoFile(file);
      setLivePreview(URL.createObjectURL(file));
    }
  };

  const removeDoc = (e) => {
    e.stopPropagation();
    setDocumentFile(null);
    setDocPreview(null);
  };

  const removeLive = (e) => {
    e.stopPropagation();
    setLivePhotoFile(null);
    setLivePreview(null);
  };

  const startWebcam = async () => {
    try {
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access note:", err);
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "passenger_photo.jpg", { type: "image/jpeg" });
        setLivePhotoFile(file);
        setLivePreview(URL.createObjectURL(blob));
        stopWebcam();
      }
    }, "image/jpeg", 0.95);
  };

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <div className="w-full">
      {/* 2-Column Clean Ingestion Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card A: Travel Document */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
                  Travel Document
                </h2>
                <p className="text-xs text-[#86868B] font-normal">
                  Upload scanned passport, visa, or national ID
                </p>
              </div>
            </div>

            {/* Dropzone */}
            {docPreview ? (
              <div className="relative rounded-xl border border-[#E5E5EA] bg-[#FBFBFD] p-3 flex flex-col items-center justify-center min-h-[220px]">
                <img
                  src={docPreview}
                  alt="Document Preview"
                  className="max-h-44 object-contain rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeDoc}
                  title="Remove document"
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#1D1D1F]/70 hover:bg-[#1D1D1F] text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
                <div className="mt-3 text-[11px] text-[#34C759] font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready for verification
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#D2D2D7] hover:border-[#0071E3] rounded-xl bg-[#FBFBFD] p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[220px] text-center group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDocChange}
                  className="hidden"
                  disabled={isScanning}
                />
                <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-medium text-[#1D1D1F] mb-1">
                  Click to upload or drag and drop
                </div>
                <div className="text-xs text-[#86868B]">
                  Supports PDF, JPG, PNG up to 10MB
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Card B: Passenger Live Photo */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
                  Passenger Photo
                </h2>
                <p className="text-xs text-[#86868B] font-normal">
                  Capture live facial image at the checkpoint
                </p>
              </div>
            </div>

            {/* Camera / Photo Container */}
            <div className="bg-[#F5F5F7] rounded-xl border border-[#E5E5EA] flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              {isWebcamActive ? (
                <div className="relative w-full h-full min-h-[220px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-52 object-cover scale-x-[-1]"
                  />
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={captureSnapshot}
                      className="px-5 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Camera className="w-3.5 h-3.5" /> Take Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopWebcam}
                      className="px-3 py-2 rounded-full bg-[#FFFFFF] hover:bg-[#E5E5EA] text-[#1D1D1F] font-medium text-xs border border-[#E5E5EA] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : livePreview ? (
                <div className="relative p-3 w-full flex flex-col items-center justify-center min-h-[220px]">
                  <img
                    src={livePreview}
                    alt="Passenger Preview"
                    className="max-h-44 object-contain rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={removeLive}
                    title="Remove photo"
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#1D1D1F]/70 hover:bg-[#1D1D1F] text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                  <div className="mt-3 text-[11px] text-[#34C759] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Photo acquired
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <button
                    type="button"
                    onClick={startWebcam}
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-sm transition-all inline-flex items-center gap-2 active:scale-95"
                  >
                    <Camera className="w-4 h-4 stroke-[2]" /> Start Camera
                  </button>
                  <div>
                    <label className="text-xs text-[#0071E3] hover:underline cursor-pointer font-normal">
                      Or choose photo from files
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLiveChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Primary Screening Action Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onScan}
          disabled={isScanning || !documentFile}
          className={`h-12 px-10 rounded-full font-medium text-base transition-all flex items-center justify-center gap-2.5 mx-auto ${
            !documentFile
              ? 'bg-[#E5E5EA] text-[#86868B] cursor-not-allowed shadow-none'
              : 'bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.99] text-white shadow-[0_4px_14px_rgba(0,113,227,0.3)]'
          }`}
        >
          <ShieldCheck className="w-5 h-5 stroke-[2]" />
          <span>Verify Document & Identity</span>
        </button>
      </div>

    </div>
  );
}
