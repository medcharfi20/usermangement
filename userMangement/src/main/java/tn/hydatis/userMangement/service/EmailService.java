package tn.hydatis.userMangement.service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender emailSender;
    private final SpringTemplateEngine templateEngine;
    private final String fromAddress = "mohamedcharfi4070@gmail.com"; // Use a configurable property if needed

    public EmailService(JavaMailSender emailSender, SpringTemplateEngine templateEngine) {
        this.emailSender = emailSender;
        this.templateEngine = templateEngine;
    }

    public void sendPasswordResetEmail(String to, String name, String newPassword) throws MessagingException {
        // Prepare the email context
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("newPassword", newPassword);

        // Generate the email content using Thymeleaf template
        String htmlContent = templateEngine.process("password-reset-email", context);

        // Create a MIME message
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");

        messageHelper.setFrom(fromAddress); // Use a configurable property if needed
        messageHelper.setTo(to);
        messageHelper.setSubject("Your Password Has Been Updated");
        messageHelper.setText(htmlContent, true); // true indicates HTML content

        // Send the email
        emailSender.send(mimeMessage);
    }
}
