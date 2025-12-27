import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileAudio,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Upload,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { saveAnalysisToSession } from "../utils/sessionManager";
import FAERSChart from "./FAERSChart";

const CollapsibleSection = ({
  title,
  count,
  children,
  defaultOpen = false,
  icon: Icon,
  colorClass = "text-foreground",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon size={16} className={colorClass} />}
          <span className="text-sm font-medium text-foreground">{title}</span>
          {count > 0 && (
            <span className="text-xs bg-accent px-2 py-0.5 rounded-full text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown size={16} className="text-muted-foreground" />
        ) : (
          <ChevronRight size={16} className="text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 pt-0 space-y-3 border-t border-border/50 bg-card/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CallAnalysis = ({ preloadedAnalysis }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const activeBubbleRef = useRef(null);

  // Load preloaded analysis if provided
  useEffect(() => {
    if (preloadedAnalysis) {
      setData(preloadedAnalysis.data);
      setFileName(preloadedAnalysis.fileName);
      // Note: audioUrl won't be available from session storage
    }
  }, [preloadedAnalysis]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    // Create URL for audio playback
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      setData(result);

      // Save to session storage
      saveAnalysisToSession({
        fileName: file.name,
        ...result,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleJumpToTime = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (activeBubbleRef.current) {
      activeBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime]);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightEntities = (text, entities) => {
    if (!entities) return text;

    const sortedEntities = [...entities].sort(
      (a, b) => b.Text.length - a.Text.length
    );

    let parts = [{ text: text, isEntity: false }];

    sortedEntities.forEach((entity) => {
      const entityText = entity.Text;
      const entityType = entity.Category;

      let newParts = [];
      parts.forEach((part) => {
        if (part.isEntity) {
          newParts.push(part);
        } else {
          const regex = new RegExp(`(${escapeRegExp(entityText)})`, "gi");
          const split = part.text.split(regex);
          split.forEach((s) => {
            if (s.toLowerCase() === entityText.toLowerCase()) {
              newParts.push({ text: s, isEntity: true, type: entityType });
            } else if (s !== "") {
              newParts.push({ text: s, isEntity: false });
            }
          });
        }
      });
      parts = newParts;
    });

    return parts.map((part, i) => {
      if (part.isEntity) {
        let colorClass = "bg-gray-100 text-gray-700";
        if (part.type === "MEDICATION")
          colorClass = "bg-blue-100 text-blue-700 border-blue-200";
        if (part.type === "MEDICAL_CONDITION")
          colorClass = "bg-red-100 text-red-700 border-red-200";
        if (part.type === "ANATOMY")
          colorClass = "bg-green-100 text-green-700 border-green-200";

        return (
          <span
            key={i}
            className={`text-xs px-1 py-0.5 rounded border ${colorClass} font-medium mx-0.5`}
          >
            {part.text}
          </span>
        );
      }
      return part.text;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const truncateFileName = (name, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const renderTranscript = () => {
    if (!data || !data.utterances) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <FileAudio size={48} className="mb-4 opacity-20" />
          <p>Upload an audio file to view the transcript.</p>
        </div>
      );
    }

    return data.utterances.map((utt, index) => {
      const isNurse = utt.speaker === 0;
      const alignment = isNurse ? "flex-row" : "flex-row-reverse";

      // Check if this utterance is active based on current audio time
      const isActive = currentTime >= utt.start && currentTime <= utt.end;

      // Nurse: Green, Patient: Blue
      let bubbleColor = isNurse
        ? "bg-green-50 border-green-100"
        : "bg-blue-50 border-blue-100";
      let avatarColor = isNurse
        ? "bg-green-100 text-green-700"
        : "bg-blue-100 text-blue-700";

      // Highlight active bubble
      if (isActive) {
        bubbleColor = isNurse
          ? "bg-green-100 border-green-300 ring-2 ring-green-200"
          : "bg-blue-100 border-blue-300 ring-2 ring-blue-200";
      }

      const label = isNurse ? "NURSE" : "PT";
      const highlightedText = highlightEntities(utt.text, data.entities);

      return (
        <div
          key={index}
          className={`flex space-x-4 ${alignment} transition-all duration-300 ${
            isActive ? "scale-[1.02]" : ""
          }`}
          ref={isActive ? activeBubbleRef : null}
        >
          <div
            className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 border-white shadow-sm`}
          >
            {label}
          </div>
          <div
            className={`flex-1 flex flex-col ${
              isNurse ? "items-start" : "items-end"
            }`}
          >
            <p className={`text-xs text-muted-foreground mb-1`}>
              {formatTime(utt.start)}
            </p>
            <div
              onClick={() => handleJumpToTime(utt.start)}
              className={`${bubbleColor} border p-4 rounded-2xl ${
                isNurse ? "rounded-tl-none" : "rounded-tr-none"
              } text-foreground text-sm leading-relaxed shadow-sm max-w-[85%] transition-colors duration-300 cursor-pointer hover:opacity-80`}
            >
              {highlightedText}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Call Analysis</h1>
          <p className="text-muted-foreground">
            {fileName
              ? `Analyzing: ${fileName.replace(/\.[^/.]+$/, "")}`
              : "Upload an audio file to begin analysis"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="audio/*"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Upload size={18} />
            )}
            <span>{isLoading ? "Analyzing..." : "Upload Audio"}</span>
          </button>

          {data && (
            <div
              className={`px-4 py-2 rounded-lg border font-bold flex items-center space-x-2 shadow-sm ${
                data.risk_analysis?.level === "Critical"
                  ? "bg-red-100 text-red-700 border-red-300 pulse-critical"
                  : data.risk_analysis?.level === "Moderate"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                  : "bg-green-100 text-green-700 border-green-300"
              }`}
            >
              {data.risk_analysis?.level === "Critical" && (
                <AlertTriangle size={18} />
              )}
              <span>Risk Score: {data.risk_analysis?.score || "N/A"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Left Column: Transcript + FAERS Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transcript Area */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm flex flex-col overflow-hidden h-[600px]">
            <div className="p-4 border-b border-border bg-card/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="font-semibold text-foreground flex items-center mr-4 flex-shrink-0">
                  <FileText size={18} className="mr-2 text-primary" />
                  Call Transcript
                </h2>
                {audioUrl && (
                  <div className="flex items-center space-x-3 bg-accent border border-border/50 px-3 py-1.5 rounded-full shadow-sm max-w-full overflow-hidden">
                    <button
                      onClick={handlePlayPause}
                      className="text-primary hover:text-primary/80 flex-shrink-0"
                    >
                      {isPlaying ? (
                        <Pause size={16} className="fill-current" />
                      ) : (
                        <Play size={16} className="fill-current" />
                      )}
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-xs font-medium text-foreground truncate"
                        title={fileName}
                      >
                        {truncateFileName(fileName)}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded flex-shrink-0 ml-2">
                Processed via Deepgram
              </span>
            </div>
            <div
              className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth"
              ref={transcriptContainerRef}
            >
              {renderTranscript()}
            </div>
          </div>

          {/* FAERS Chart */}
          <FAERSChart data={data} />
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6 flex flex-col">
          {/* Severity Score */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center">
              <Activity size={18} className="mr-2 text-primary" />
              Risk Assessment
            </h2>

            <div className="mb-6 text-center">
              <div
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-2 transition-all duration-300 ${
                  data?.risk_analysis?.level === "Critical"
                    ? "border-red-500 bg-red-50 pulse-critical glow-critical"
                    : data?.risk_analysis?.level === "Moderate"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-green-500 bg-green-50"
                }`}
              >
                <span
                  className={`text-3xl font-bold ${
                    data?.risk_analysis?.level === "Critical"
                      ? "text-red-600"
                      : data?.risk_analysis?.level === "Moderate"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {data?.risk_analysis?.score || "0.0"}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Severity Score (0-10)
              </p>
              {data?.risk_analysis?.level === "Critical" && (
                <div className="mt-2 flex items-center justify-center space-x-1 text-red-600 animate-pulse">
                  <AlertTriangle size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Critical Alert
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Condition</span>
                <span className="text-sm font-medium text-foreground">
                  {data?.risk_analysis?.level || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Urgency</span>
                <span
                  className={`text-sm font-bold ${
                    data?.risk_analysis?.level === "Critical"
                      ? "text-red-600"
                      : data?.risk_analysis?.level === "Moderate"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {data?.risk_analysis?.level === "Critical"
                    ? "Immediate Attention"
                    : data?.risk_analysis?.level === "Moderate"
                    ? "Monitor Closely"
                    : "Routine Check"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-xl border-2 border-green-200 shadow-lg p-6">
            <h2 className="font-bold text-foreground mb-4 flex items-center text-lg">
              <CheckCircle size={20} className="mr-2 text-green-600" />
              Recommended Actions
            </h2>
            {data?.risk_analysis?.action_plan ? (
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                <div className="p-4 bg-white/80 rounded-lg border border-green-200 shadow-sm">
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {data.risk_analysis.action_plan}
                  </p>
                </div>
                <div className="mt-3 flex items-center space-x-2 text-xs text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    AI-Generated Clinical Guidance
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/60 rounded-lg border border-green-100 text-sm text-muted-foreground text-center">
                Recommendations will appear after analysis
              </div>
            )}
          </div>

          {/* Risk Factors */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm p-5 flex-1">
            <h2 className="font-semibold text-foreground mb-4 flex items-center">
              <AlertTriangle size={18} className="mr-2 text-orange-500" />
              Identified Risks
            </h2>
            <div className="space-y-3">
              <CollapsibleSection
                title="FAERS Alerts"
                count={data?.faers_data?.details?.length || 0}
                icon={AlertTriangle}
                colorClass="text-red-500"
              >
                <div className="max-h-96 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {data?.faers_data?.details?.map((detail, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 border border-red-100 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                          Critical Match
                        </span>
                      </div>
                      <p className="text-sm font-medium text-red-900">
                        {detail.drug} + {detail.symptom}
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        {detail.reports} reports found in database.
                      </p>
                    </div>
                  ))}
                </div>
                {(!data?.faers_data?.details ||
                  data.faers_data.details.length === 0) && (
                  <p className="text-xs text-muted-foreground p-2">
                    {data?.entities?.some((e) => e.Category === "MEDICATION")
                      ? "No FAERS alerts detected for the identified medications."
                      : "No medications detected in the transcript to analyze."}
                  </p>
                )}
              </CollapsibleSection>

              <CollapsibleSection
                title="Detected Symptoms"
                count={
                  data?.entities?.filter(
                    (e) => e.Category === "MEDICAL_CONDITION"
                  ).length || 0
                }
                icon={Activity}
                colorClass="text-orange-500"
              >
                <div className="max-h-96 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {data?.entities
                    ?.filter((e) => e.Category === "MEDICAL_CONDITION")
                    .map((entity, idx) => (
                      <div
                        key={`sym-${idx}`}
                        className="p-3 bg-orange-50 border border-orange-100 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                            Symptom
                          </span>
                        </div>
                        <p className="text-sm font-medium text-orange-900">
                          {entity.Text}
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                          Frequency: {entity.Frequency}
                        </p>
                      </div>
                    ))}
                </div>
                {!data?.entities?.some(
                  (e) => e.Category === "MEDICAL_CONDITION"
                ) && (
                  <p className="text-xs text-muted-foreground p-2">
                    No symptoms detected.
                  </p>
                )}
              </CollapsibleSection>

              {!data && (
                <p className="text-sm text-muted-foreground text-center">
                  Upload audio to see risks.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CallAnalysis;
