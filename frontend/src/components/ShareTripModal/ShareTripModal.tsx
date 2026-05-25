import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import BaseModal from '../BaseModal/BaseModal';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteUrl: string;
}

const ShareTripModal = ({ isOpen, onClose, inviteUrl }: ShareTripModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-5">
        <div className="text-center">
          <h2 className="text-[20px] font-bold text-[#0066D2]">Share Trip</h2>
          <p className="mt-1 text-[14px] text-[#0066D2]/60">
            Scan the QR code or copy the link to invite someone to your trip.
          </p>
        </div>

        <div className="rounded-xl border border-[#0066D2]/15 p-4">
          <QRCodeSVG
            value={inviteUrl}
            size={180}
            fgColor="#0066D2"
            bgColor="#ffffff"
            level="M"
          />
        </div>

        <button
          onClick={handleCopy}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0066D2]/20 bg-[#0066D2]/5 px-4 py-2.5 text-[14px] font-semibold text-[#0066D2] transition-all hover:bg-[#0066D2]/10"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Link copied!' : 'Copy invite link'}
        </button>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#0066D2] py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Close
        </button>
      </div>
    </BaseModal>
  );
};

export default ShareTripModal;
