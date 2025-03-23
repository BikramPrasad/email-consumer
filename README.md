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
🔧 AWS & Environment Setup
✅ Make sure your AWS CLI is configured:

bash
Copy
Edit
aws configure
✅ Set up your MongoDB URI (Cloud MongoDB Atlas or Local instance)

✅ Get your SMTP credentials (e.g., Mailtrap, Gmail, etc.)

🔐 Setup Environment Variables
Create a .env file in your project root:


MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/swiftdrop
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_pass
EMAIL_FROM=noreply@gmail.com
Make sure these variables are loaded using serverless-dotenv-plugin in your serverless.yml

📦 Install Dependencies
bash
Copy
Edit
npm install

🧪 Local Testing Setup
You can simulate an SNS event locally using Serverless.

1️⃣ Create a sample event file event.json:
json
```
{
  "Records": [
    {
      "Sns": {
        "Message": "{\"from\":\"johndoe@gmail.com\",\"to\":[\"johdoe97@gmail.com\"],\"message\":\"Kube Sheet\",\"title\":\"Kubernetes sheet\",\"fileId\":\"ff3a54cc-3b6c-466d-818a-9155cb942641\"}"
      }
    }
  ]
}```

2️⃣ Invoke the function locally:
serverless invoke local -f consumeEmail --path event.json

Or use:
npm test
You should see logs for email sent successfully and a MongoDB entry created.

📡 Deploy to AWS
bash
sls deploy
This will:

Deploy the Lambda function
Create required IAM roles
Subscribe the function to the defined SNS Topic in serverless.yml

🧪 Test on AWS (Post Deployment)
✅ Option 1: Manually publish a test SNS message

```
aws sns publish \
  --topic-arn arn:aws:sns:<your-region>:<account-id>:<your-topic-name> \
  --message '{"username":"Alice","others":"bob@example.com","fileUrl":"https://s3.aws.com/file.pdf","fileSize":"4 MB","message":"Take a look!"}'```

  🧼 Cleanup
To remove all deployed AWS resources:
```
sls remove
```
