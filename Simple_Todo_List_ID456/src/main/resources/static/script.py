import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class JavaCodeChecker {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Please provide the path to the Java file as an argument.");
            return;
        }

        String filePath = args[0];
        File file = new File(filePath);

        try {
            CompilationUnit cu = StaticJavaParser.parse(file);
            List<String> issues = new ArrayList<>();

            // Check for System.out.println usage
            cu.findAll(MethodDeclaration.class).forEach(md -> {
                md.getBody().ifPresent(body -> {
                    if (body.toString().contains("System.out.println")) {
                        issues.add("Warning: System.out.println found in method " + md.getName() + ". Consider using a logger.");
                    }
                });
            });

            // Check for TODO and FIXME comments
            cu.getAllContainedComments().forEach(comment -> {
                String commentText = comment.getContent().toLowerCase();
                if (commentText.contains("todo") || commentText.contains("fixme")) {
                    issues.add("Warning: TODO or FIXME found in comment at line " + comment.getBegin().get().line);
                }
            });

            // Print issues or success message
            if (issues.isEmpty()) {
                System.out.println("No issues found in the Java file.");
            } else {
                System.out.println("Issues found in the Java file:");
                issues.forEach(System.out::println);
            }

        } catch (FileNotFoundException e) {
            System.out.println("Error: File not found - " + filePath);
        } catch (Exception e) {
            System.out.println("Error parsing the Java file: " + e.getMessage());
        }
    }
}