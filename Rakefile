require "bundler/setup"
require "sproutcore"
require "erb"
require "uglifier"

LICENSE = File.read("generators/license.js")

def strip_require(file)
  result = File.read(file)
  result.gsub!(%r{^\s*require\(['"]([^'"])*['"]\);?\s*$}, "")
  result
end

def uglify(file)
  uglified = Uglifier.compile(File.read(file))
  "#{LICENSE}\n#{uglified}"
end

VERSION = File.read("VERSION").chomp

regular_path = "dist/transformjs.#{VERSION}.js"
minified_path = "dist/transformjs.#{VERSION}.min.js"

file regular_path do
  puts "Generating #{regular_path}"

  mkdir_p "dist"

  sylvester = strip_require("lib/sylvester.js")
  csshooks = strip_require("lib/css_hooks.js")

  File.open(regular_path, 'w') do |file|
    file.puts sylvester
    file.puts csshooks
  end
end

file minified_path => regular_path do
  puts "Generating #{minified_path}"

    File.open(minified_path, 'w') do |file|
      file.puts uglify(regular_path)
    end
end

desc "Clean build artifacts from previous builds"
task :clean do
  sh "rm -rf tmp && rm -rf dist"
end

task :default => minified_path

