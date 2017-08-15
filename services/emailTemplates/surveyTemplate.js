module.exports = survey => {
  const redirectURL = process.env.REDIRECT_URL;
  const { body, id } = survey;
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>I'd like your input!</h3>
          <p>Please answer the following question:</p>
          <p>${body}</p>
          <div>
            <a href="${redirectURL}/api/surveys/${id}/yes">Yes</a>
          </div>
          <div>
            <a href="${redirectURL}/api/surveys/${id}/no">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};