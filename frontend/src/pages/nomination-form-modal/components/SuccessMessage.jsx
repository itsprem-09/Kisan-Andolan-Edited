import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';
import TranslateText from 'components/TranslateText';
import { useLanguage } from '../../../contexts/LanguageContext';
import nominationService from 'services/nominationService';

const SuccessMessage = ({ nominationData, onClose }) => {
  const { language } = useLanguage();
  const [downloadStatus, setDownloadStatus] = useState('pending');
  const [downloadError, setDownloadError] = useState(null);

  // Extract reference number or generate a fallback
  const referenceNumber = nominationData?.referenceNumber || `RKM-VPGP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const nomineeName = nominationData?.nomineeName || localStorage.getItem('nominee_name') || 'Nominee';
  const nominatorName = nominationData?.nominatorName || localStorage.getItem('nominator_name') || 'Nominator';

  // Auto-download PDF on component mount
  useEffect(() => {
    const downloadPdf = async () => {
      try {
        setDownloadStatus('downloading');
        // Try to use the API service
        try {
          await nominationService.generateAndDownloadNominationPdf(nominationData);
          setDownloadStatus('completed');
        } catch (apiError) {
          console.error('API error, using fallback:', apiError);
          // Fallback to client-side generation if API fails
          generateAndDownloadPdf();
          setDownloadStatus('completed');
        }
      } catch (error) {
        console.error('Error downloading nomination PDF:', error);
        setDownloadStatus('failed');
        setDownloadError('Failed to download nomination PDF. Please try again.');
      }
    };

    downloadPdf();

    return () => {
      // Clean up localStorage when component unmounts
      localStorage.removeItem('nominee_name');
      localStorage.removeItem('nominator_name');
      localStorage.removeItem('nominator_mobile');
    };
  }, []);

  const generateAndDownloadPdf = () => {
    // Create a client-side fallback that looks more like a PDF (using HTML instead of plain text)
    const nominationDate = new Date().toLocaleDateString();
    
    // Create a simple HTML template that looks like a PDF
    const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Nomination ${referenceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
          line-height: 1.5;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .title {
          font-size: 22px;
          color: #4a7c59;
          font-weight: bold;
        }
        .subtitle {
          font-size: 18px;
          margin-top: 10px;
        }
        .reference {
          font-size: 16px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .section {
          margin: 20px 0;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .info-row {
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Rashtriya Kishan Manch</div>
        <div class="subtitle">VP Singh – Kisan Gaurav Puraskar</div>
        <div style="margin-top: 5px;">Nomination Receipt</div>
      </div>

      <div class="reference">
        Reference Number: ${referenceNumber}
      </div>

      <div class="section">
        <div class="section-title">NOMINEE DETAILS</div>
        <div class="info-row">Name: ${nominationData.nomineeName || 'Not provided'}</div>
        <div class="info-row">Age: ${nominationData.nomineeAge || 'Not provided'}</div>
        <div class="info-row">Gender: ${nominationData.nomineeGender || 'Not provided'}</div>
        <div class="info-row">Location: ${nominationData.district}, ${nominationData.state}</div>
        <div class="info-row">Occupation: ${nominationData.occupation || 'Not provided'}</div>
      </div>

      <div class="section">
        <div class="section-title">CONTRIBUTION</div>
        <div>${nominationData.contribution || 'Not provided'}</div>
      </div>

      <div class="section">
        <div class="section-title">NOMINATOR DETAILS</div>
        <div class="info-row">Name: ${nominationData.nominatorName}</div>
        <div class="info-row">Contact: ${nominationData.nominatorMobile}</div>
        <div class="info-row">Email: ${nominationData.nominatorEmail || 'Not provided'}</div>
      </div>

      <div class="section">
        <div class="section-title">STATUS</div>
        <div>New</div>
        <div>Nomination Date: ${nominationDate}</div>
      </div>

      <div class="footer">
        <p>Note: Please keep this reference number for future communications.</p>
        <p>This is a computer-generated document. No signature required.</p>
        <p>Rashtriya Kishan Manch © ${new Date().getFullYear()}</p>
      </div>
    </body>
    </html>
    `;
    
    // Create and download the HTML file with a PDF-like layout
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nomination_${referenceNumber}.html`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadAgain = async () => {
    try {
      setDownloadStatus('downloading');
      
      try {
        // Try to use the API service first
        await nominationService.generateAndDownloadNominationPdf(nominationData);
        setDownloadStatus('completed');
      } catch (apiError) {
        console.error('API error, using fallback:', apiError);
        // Fallback to client-side generation if API fails
        generateAndDownloadPdf();
        setDownloadStatus('completed');
      }
      
      setDownloadError(null);
    } catch (error) {
      console.error('Error downloading nomination PDF:', error);
      setDownloadStatus('failed');
      setDownloadError('Failed to download nomination PDF. Please try again.');
    }
  };

  const handleNominateAnother = () => {
    // This would typically navigate to a fresh nomination form
    window.location.reload();
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-success bg-opacity-10 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={48} className="text-success" />
        </div>
      </div>
      
      {/* Success Message */}
      <div>
        <h3 className="text-xl font-heading font-bold text-success mb-2">
          <TranslateText translationKey="nominationSuccessful">Nomination Submitted Successfully!</TranslateText>
        </h3>
        <p className="text-text-secondary">
          <TranslateText translationKey="nominationSuccessMessage">
            Your nomination for the VP Singh – Kisan Gaurav Puraskar has been recorded.
          </TranslateText>
        </p>
      </div>
      
      {/* Reference Number */}
      <div className="bg-background rounded-lg border border-border p-6 max-w-md mx-auto">
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">
              <TranslateText translationKey="referenceNumber">Reference Number</TranslateText>
            </p>
            <p className="text-lg font-mono font-semibold text-primary">{referenceNumber}</p>
            <p className="text-xs text-text-secondary mt-1">
              <TranslateText translationKey="saveReferenceNumber">
                Please save this reference number for future communications
              </TranslateText>
            </p>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium flex items-center justify-center space-x-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-warning">
                <TranslateText translationKey="nominationStatusNew">
                  Nomination status: New
                </TranslateText>
              </span>
            </p>
            <p className="text-xs text-text-secondary mt-1">
              <TranslateText translationKey="reviewMessage">
                Our committee will review this nomination and may contact you for further details.
              </TranslateText>
            </p>
          </div>
        </div>
      </div>
      
      {/* Download Status */}
      {downloadStatus === 'downloading' && (
        <div className="flex items-center justify-center space-x-2 text-text-secondary">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
          <span>
            <TranslateText translationKey="downloadingNomination">Downloading your nomination details...</TranslateText>
          </span>
        </div>
      )}

      {downloadStatus === 'completed' && (
        <div className="flex items-center justify-center space-x-2 text-success">
          <Icon name="CheckCircle" size={16} />
          <span>
            <TranslateText translationKey="nominationDownloaded">Nomination details downloaded successfully!</TranslateText>
          </span>
        </div>
      )}

      {downloadStatus === 'failed' && (
        <div className="flex items-center justify-center space-x-2 text-error">
          <Icon name="AlertCircle" size={16} />
          <span>{downloadError || <TranslateText translationKey="downloadFailed">Failed to download details. Please try again.</TranslateText>}</span>
        </div>
      )}
      
      {/* What Happens Next */}
      <div className="max-w-md mx-auto pt-4">
        <h4 className="text-lg font-heading font-semibold text-text-primary mb-4">
          <TranslateText translationKey="whatHappensNext">What Happens Next?</TranslateText>
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <p className="text-sm text-text-secondary text-left">
              <TranslateText translationKey="initialScreening">
                Initial screening of all nominations
              </TranslateText>
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <p className="text-sm text-text-secondary text-left">
              <TranslateText translationKey="shortlisting">
                Shortlisting of qualified candidates
              </TranslateText>
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <p className="text-sm text-text-secondary text-left">
              <TranslateText translationKey="fieldVerification">
                Field verification and committee review
              </TranslateText>
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-primary">4</span>
            </div>
            <p className="text-sm text-text-secondary text-left">
              <TranslateText translationKey="finalSelection">
                Final selection and award ceremony
              </TranslateText>
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="pt-2 space-y-4">
        <button
          onClick={handleDownloadAgain}
          className={`btn-outline mb-4 ${
            downloadStatus === 'downloading' 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
          disabled={downloadStatus === 'downloading'}
        >
          {downloadStatus === 'downloading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
              <TranslateText translationKey="downloading">Downloading...</TranslateText>
            </>
          ) : (
            <>
              <Icon name="Download" size={18} className="mr-2" />
              <TranslateText translationKey="downloadNominationDetails">Download Nomination Details</TranslateText>
            </>
          )}
        </button>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleNominateAnother}
            className="btn-outline w-full sm:w-auto"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            <TranslateText translationKey="nominateAnother">Nominate Another Person</TranslateText>
          </button>
          
          <button
            onClick={onClose}
            className="btn-primary w-full sm:w-auto"
          >
            <Icon name="Home" size={18} className="mr-2" />
            <TranslateText translationKey="returnToHome">Return to Home Page</TranslateText>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage; 