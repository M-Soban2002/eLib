import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiServiceBook {
  final String baseUrl;

  ApiServiceBook(this.baseUrl);

  Future<List<Map<String, dynamic>>> getAllBooks(int page, int limit) async {
    final response =
        await http.get(Uri.parse('$baseUrl/books?page=$page&limit=$limit'));
    if (response.statusCode == 200) {
      final List<dynamic> booksData = jsonDecode(response.body);
      return booksData.map((bookData) {
        return {
          'title': bookData['title'],
          'author': bookData['author'],
          'coverAddress': bookData['coverAddress'],
        };
      }).toList();
    } else {
      throw Exception('Failed to load books');
    }
  }

  Future<dynamic> getBookById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/books/$id'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load book');
    }
  }

  Future<List<dynamic>> searchBooks(String query) async {
    final response =
        await http.get(Uri.parse('$baseUrl/books/search?q=$query'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to search books');
    }
  }

  Future<void> deleteBookById(String id) async {
    final response = await http.delete(Uri.parse('$baseUrl/books/$id'));
    if (response.statusCode != 200) {
      throw Exception('Failed to delete book');
    }
  }

  // Add other API integration functions here
}
