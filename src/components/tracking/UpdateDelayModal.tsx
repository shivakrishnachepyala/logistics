import React, { useState } from 'react';
import type { Shipment, DelayReasonCode, ShipmentStatus } from '../../types';
import { updateShipmentDelayAdvisory } from '../../data/mockShipments';
import { IndustrialIcon } from '../common/IndustrialIcon';

interface UpdateDelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
  onSuccess?: (updatedShipment: Shipment) => void;
}

const REASON_OPTIONS: { code: DelayReasonCode; label: string }[] = [
  { code: 'road_blocked', label: 'Highway Congestion / Road Blockage / Toll Bottleneck' },
  { code: 'vehicle_breakdown', label: 'Vehicle Breakdown / Mechanical Failure / Relay Required' },
  { code: 'heavy_rain', label: 'Inclement Weather / Severe Rain / Seasonal Fog' },
  { code: 'festival_rush', label: 'Peak Volume Surge / Festival Backlog at Hub' },
  { code: 'receiver_unavailable', label: 'Consignee Unavailable / Delivery Attempt Postponed' },
  { code: 'wrong_address', label: 'Address Incomplete / Landmark Clarification Required' },
  { code: 'other', label: 'Corridor Transit Investigation / Operational Clearance' }
];

const UpdateDelayModalDialog: React.FC<Omit<UpdateDelayModalProps, 'isOpen'>> = ({
  onClose,
  shipment,
  onSuccess
}) => {
  const existingDelay = shipment.delayInfo;

  const [status, setStatus] = useState<ShipmentStatus>(
    shipment.status === 'delivered' ? 'delayed' : (shipment.status || 'delayed')
  );
  const [reasonCode, setReasonCode] = useState<DelayReasonCode>(
    existingDelay?.reasonCode || 'road_blocked'
  );
  const [customerExplanation, setCustomerExplanation] = useState<string>(
    existingDelay?.customerExplanation || existingDelay?.reason || ''
  );
  const [actionTaken, setActionTaken] = useState<string>(
    existingDelay?.actionTaken || ''
  );
  const [location, setLocation] = useState<string>(
    existingDelay?.location || `${shipment.originHub} - ${shipment.destinationHub} Transit Corridor`
  );
  const [originalEta, setOriginalEta] = useState<string>(
    existingDelay?.originalEta || shipment.eta || ''
  );
  const [revisedEta, setRevisedEta] = useState<string>(
    existingDelay?.revisedEta || 'Tomorrow 06:00 PM'
  );
  const [durationText, setDurationText] = useState<string>(
    existingDelay?.durationText || '8 Hours'
  );
  const [internalNotes, setInternalNotes] = useState<string>(
    existingDelay?.internalNotes || ''
  );
  const [updatedBy, setUpdatedBy] = useState<string>('Rohit Verma (Operations Manager)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const updated = updateShipmentDelayAdvisory({
        shipmentId: shipment.id,
        status,
        reasonCode,
        customerExplanation,
        actionTaken,
        location,
        originalEta,
        revisedEta,
        durationText,
        internalNotes,
        updatedBy
      });

      if (updated) {
        setFeedbackMsg('Delay advisory successfully saved and published across portals.');
        setTimeout(() => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess(updated);
          onClose();
        }, 600);
      } else {
        setIsSubmitting(false);
        setFeedbackMsg('Error: Shipment record not found.');
      }
    } catch {
      setIsSubmitting(false);
      setFeedbackMsg('Unexpected error saving delay advisory.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                Manager Operations
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {shipment.id}
              </span>
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-900 mt-1">
              Record / Update Shipment Delay Advisory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {shipment.originHub} → {shipment.destinationHub} • Consignor: {shipment.sender.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg text-lg leading-none"
            title="Close dialog"
          >
            ✕
          </button>
        </div>

        {feedbackMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <IndustrialIcon name="check" size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Customer-Facing Explanation (Publicly Visible) */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IndustrialIcon name="alert" size={14} className="text-amber-700" />
                <span className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                  Customer-Facing Advisory (Publicly Visible)
                </span>
              </div>
              <span className="text-[10px] text-amber-800 font-medium">
                Visible on Public Tracking, Recipient & Customer Portals
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Root Cause Category
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value as DelayReasonCode)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {REASON_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Shipment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="delayed">Delayed in Transit</option>
                  <option value="in-transit">In Transit (With Advisory)</option>
                  <option value="pending">Pending Investigation</option>
                  <option value="exception">Operational Exception</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Customer-Friendly Delay Reason / Explanation <span className="text-amber-700">*</span>
              </label>
              <textarea
                rows={2}
                value={customerExplanation}
                onChange={(e) => setCustomerExplanation(e.target.value)}
                placeholder="e.g. Highway authorities have temporarily restricted traffic on NH-48 near Bilaspur flyover for commercial vehicle inspections."
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                <strong>Important:</strong> Never invent a delay reason. If left blank, the portal will display:{' '}
                <em>"We're investigating the delay and will update you shortly."</em>
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Action Being Taken (Customer-Facing)
              </label>
              <input
                type="text"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="e.g. Relief carrier unit dispatched from Vapi depot; re-routing via NH-48 bypass."
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                  Current / Known Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. NH-48 Mile 68"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                  Original Scheduled Date
                </label>
                <input
                  type="text"
                  value={originalEta}
                  onChange={(e) => setOriginalEta(e.target.value)}
                  placeholder="e.g. 20/10/2026, 11:00 AM"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                  Revised Estimated Arrival
                </label>
                <input
                  type="text"
                  value={revisedEta}
                  onChange={(e) => setRevisedEta(e.target.value)}
                  placeholder="e.g. 20/10/2026, 07:00 PM (or leave blank if pending)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-semibold text-amber-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                  Estimated Duration Delay
                </label>
                <input
                  type="text"
                  value={durationText}
                  onChange={(e) => setDurationText(e.target.value)}
                  placeholder="e.g. 8 Hours"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Internal Operational Notes (CONFIDENTIAL - STAFF ONLY) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IndustrialIcon name="lock" size={14} className="text-slate-700" />
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Internal Operational Notes (Confidential – Staff Only)
                </span>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                NEVER EXPOSED TO CUSTOMER
              </span>
            </div>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Private operational notes: telematics trouble code, driver call log, RTO checkpoint queue length, contractor ticket number, warehouse bay escalation notes..."
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Maintains strict separation between operational dispatch communications and public customer tracking.
            </p>
          </div>

          {/* Section 3: Author and Submission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Logging Manager / Officer
              </label>
              <input
                type="text"
                value={updatedBy}
                onChange={(e) => setUpdatedBy(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>
            <div className="flex items-end justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <IndustrialIcon name="check" size={14} />
                <span>{isSubmitting ? 'Saving...' : 'Save & Publish Advisory'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Section 4: Delay History Log */}
        {shipment.delayInfo?.history && shipment.delayInfo.history.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <IndustrialIcon name="clock" size={13} />
              <span>Delay Revision History ({shipment.delayInfo.history.length} updates logged)</span>
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {shipment.delayInfo.history.map((h) => (
                <div
                  key={h.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800">{h.updatedBy}</span>
                    <span className="font-mono text-[10px]">{h.timestamp}</span>
                  </div>
                  <div className="text-slate-800">
                    <strong className="text-amber-800 font-semibold">Customer explanation:</strong>{' '}
                    {h.customerExplanation}
                  </div>
                  {h.actionTaken && (
                    <div className="text-slate-600">
                      <strong className="text-slate-700 font-semibold">Action:</strong> {h.actionTaken}
                    </div>
                  )}
                  {h.internalNotes && (
                    <div className="text-slate-500 font-mono text-[10px] bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                      <strong className="text-rose-600 font-semibold">Staff note:</strong> {h.internalNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const UpdateDelayModal: React.FC<UpdateDelayModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onSuccess
}) => {
  if (!isOpen) return null;

  return (
    <UpdateDelayModalDialog
      key={`${shipment.id}-${shipment.delayInfo?.updatedAt || ''}`}
      onClose={onClose}
      shipment={shipment}
      onSuccess={onSuccess}
    />
  );
};
