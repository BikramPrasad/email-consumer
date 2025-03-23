# 📬 Email Consumer Service 
This is the **Email Consumer microservice** for SwiftDrop. It listens to messages published on an **AWS SNS Topic**, processes the incoming message, and sends an email using a dynamic **EJS template**. It also stores the record in **MongoDB** for logging or tracking purposes.


## 🚀 Tech Stack

- Serverless Framework (AWS Lambda)
- Node.js
- AWS SNS (Trigger)
- AWS SDK v3
- MongoDB (via Mongoose)
- EJS Email Templates

## ⚙️ Prerequisites

- Node.js (v18+)
- Serverless Framework
  ```bash
  npm i -g serverless
  AWS CLI configured
  ```

aws configure
MongoDB URI (Cloud MongoDB or Local)

SMTP credentials (e.g., Mailtrap, Gmail)

🔐 Setup Environment Variables
Create a .env file in your project root:

MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/swiftdrop
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_pass
EMAIL_FROM=noreply@gmail.com
Make sure these variables are loaded using serverless-dotenv-plugin in your serverless.yml.

📦 Install Dependencies
npm install
🧪 Local Testing Setup
You can simulate an SNS event using serverless invoke local.
1️⃣ Create a sample event file event.json:
{
  "Records": [
    {
      "Sns": {
        "Message": "{\"from\":\"johndoe@gmail.com\",\"to\":[\"johdoe97@gmail.com\"],\"message\":\"Kube Sheet\",\"title\":\"Kubernetes sheet\",\"fileId\":\"ff3a54cc-3b6c-466d-818a-9155cb942641\"}"
      }
    }
  ]
}

2️⃣ Invoke the function locally:
serverless invoke local -f consumeEmail --path event.json or npm test
You should see a log for email sent and MongoDB entry created.

📡 Deploy to AWS
sls deploy
This will:

Deploy the Lambda function
Create necessary IAM roles
Subscribe the function to the SNS topic defined in serverless.yml

🧪 Test on AWS (Post Deployment)
✅ Option 1: Manually publish a test SNS message
aws sns publish \
 --topic-arn arn:aws:sns:your-region:account-id:your-topic-name \
 --message '{"username":"Alice","others":"bob@example.com","fileUrl":"https://s3.aws.com/file.pdf","fileSize":"4 MB","message":"Take a look!"}'
✅ Option 2: Trigger automatically via another service
(e.g., S3 Upload → SNS → Lambda Trigger Chain)

📁 Notes
Email template is in templates/emailTemplate.ejs

MongoDB stores a log of each email sent

EJS template is fully customizable to fit your branding

🧼 Cleanup
To remove all deployed resources from AWS:
sls remove
