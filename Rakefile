require 'rake/clean'

desc 'Generate tags page'
task :tags do
  puts "Generating tags..."
  require 'rubygems'
  require 'jekyll'
  include Jekyll::Filters

  options = Jekyll.configuration({})
  site = Jekyll::Site.new(options)
  site.read_posts('')
  site.tags.sort.each do |category, posts|

    category_slug = category.downcase.gsub(' ', '-')
    html = ''
    html << <<-HTML
---
layout: default
title: Posts tagged "#{category}"
tag: #{category}
type: "#{category.gsub(/\b\w/){$&.upcase}}"
---
    <h1 class="title" id="#{category}">Posts tagged <em>#{category}</em></h1>

    <ul>
      {% for post in site.tags['#{category}'] %}
      {% include item.html %}
      {% endfor %}
    </ul>
    HTML

    FileUtils.mkdir_p "tag/#{category_slug}"
    File.open("tag/#{category_slug}/index.html", 'w+') do |file|
      file.puts html
    end

    # ATOM.xml

    html = ''
    html << <<-HTML
---
layout: nil
---
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">

 <title>Disembrangling Programming</title>
 <link href="http://embrangler.com/tag/#{category_slug}/atom.xml" rel="self"/>
 <link href="http://embrangler.com/tag/#{category_slug}"/>
 <updated>{{ site.time | date_to_xmlschema }}</updated>
 <id>http://embrangler.com/</id>
 <author>
   <name>Paul Craciunoiu</name>
   <email>paul@craciunoiu.net</email>
 </author>

 {% for post in site.tags['#{category}'] %}
 <entry>
   <title>{{ post.title }}</title>
   <link href="http://embrangler.com{{ post.url }}"/>
   <updated>{{ post.date | date_to_xmlschema }}</updated>
   <id>http://embrangler.com{{ post.id }}</id>
   <content type="html">{{ post.content | xml_escape }}</content>
 </entry>
 {% endfor %}

</feed>
    HTML

    File.open("tag/#{category_slug}/atom.xml", 'w+') do |file|
      file.puts html
    end

  end
  puts 'Done.'
end

