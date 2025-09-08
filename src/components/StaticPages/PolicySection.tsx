interface PolicySectionProps {
  data: {
    htmlContent: string;
  };
}

const PolicySection = ({ data }: PolicySectionProps) => {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[120px] pt-12 md:pt-[60px] pb-16 md:mb-[-130px]">
        <div
          className="text-white policy-content prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: data.htmlContent }}
        />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .policy-content h1 {
            font-size: 68px;
            font-weight: 700;
            line-height: 72px;
            letter-spacing: -2px;
            color: white;
            margin-bottom: 40px;
          }
          
          .policy-content h2 {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin: 40px 0 16px 0;
          }
          
          .policy-content h3 {
            font-size: 20px;
            font-weight: 600;
            color: white;
            margin: 40px 0 16px 0;
          }
          
          .policy-content p {
            font-size: 16px;
            line-height: 24px;
            color: #FFFFFF;
            margin-bottom: 24px;
          }
          
          .policy-content ol {
            padding-left: 20px;
            margin-bottom: 32px;
            color: #FFFFFF;
            list-style-type: decimal;
            list-style-position: outside;
          }
          
          .policy-content ul {
            padding-left: 20px;
            margin-bottom: 24px;
            color: #FFFFFF;
            list-style-type: disc;
            list-style-position: outside;
          }
          
          .policy-content li {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 8px;
            color: #FFFFFF;
          }
          
          .policy-content ul li {
            margin-bottom: 12px;
          }
          
          .policy-content ol li::marker {
            color: white;
            font-weight: 600;
          }
          
          .policy-content ul li::marker {
            color: white;
          }
          
          .policy-content a {
            color: #00DBDC;
            text-decoration: underline;
            word-break: break-word;
          }
          
          .policy-content a:hover {
            color: #00DBDC;
          }
          
          .policy-content strong {
            color: white;
          }
          
          .policy-content blockquote {
            background: #2a2a2a;
            padding: 20px;
            border-left: 4px solid #00DBDC;
            margin: 20px 0;
            font-family: monospace;
            color: #e5e5e5;
            border-radius: 4px;
          }
          
          .policy-content blockquote p {
            color: #e5e5e5;
            margin-bottom: 16px;
          }
          
          .policy-content blockquote p:last-child {
            margin-bottom: 0;
          }
          
          @media (max-width: 768px) {
            .policy-content h1 {
              font-size: 32px;
              line-height: 38px;
              letter-spacing: -1px;
              margin-bottom: 24px;
            }
            
            .policy-content h2 {
              font-size: 20px;
              line-height: 26px;
              margin: 32px 0 12px 0;
            }
            
            .policy-content h3 {
              font-size: 18px;
              line-height: 24px;
              margin: 28px 0 12px 0;
            }
            
            .policy-content p {
              font-size: 14px;
              line-height: 22px;
              margin-bottom: 20px;
            }
            
            .policy-content ol {
              padding-left: 16px;
              margin-bottom: 24px;
            }
            
            .policy-content ul {
              padding-left: 16px;
              margin-bottom: 20px;
            }
            
            .policy-content li {
              font-size: 14px;
              line-height: 1.5;
              margin-bottom: 6px;
            }
            
            .policy-content ul li {
              margin-bottom: 8px;
            }
            
            .policy-content blockquote {
              padding: 16px;
              margin: 16px 0;
              border-radius: 6px;
            }
            
            .policy-content blockquote p {
              font-size: 13px;
              line-height: 20px;
              margin-bottom: 12px;
            }
            
            .policy-content a {
              word-break: break-all;
              overflow-wrap: anywhere;
            }
            
            .policy-content strong {
              font-size: 14px;
              line-height: 22px;
            }
          }
          
          @media (max-width: 480px) {
            .policy-content h1 {
              font-size: 28px;
              line-height: 34px;
              margin-bottom: 20px;
            }
            
            .policy-content h2 {
              font-size: 18px;
              line-height: 24px;
              margin: 28px 0 10px 0;
            }
            
            .policy-content h3 {
              font-size: 16px;
              line-height: 22px;
              margin: 24px 0 10px 0;
            }
            
            .policy-content p {
              font-size: 13px;
              line-height: 20px;
              margin-bottom: 18px;
            }
            
            .policy-content li {
              font-size: 13px;
              line-height: 1.4;
            }
            
            .policy-content ol {
              padding-left: 14px;
              margin-bottom: 20px;
            }
            
            .policy-content ul {
              padding-left: 14px;
              margin-bottom: 18px;
            }
            
            .policy-content blockquote {
              padding: 12px;
              margin: 12px 0;
            }
            
            .policy-content blockquote p {
              font-size: 12px;
              line-height: 18px;
              margin-bottom: 10px;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default PolicySection;
