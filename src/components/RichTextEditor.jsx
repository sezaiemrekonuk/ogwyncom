import React, { useState, useEffect } from 'react';
import { $getRoot, $getSelection, $insertNodes, DecoratorNode } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
} from 'lexical';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $isHeadingNode,
  $createHeadingNode,
  HeadingNode,
  QuoteNode
} from '@lexical/rich-text';
import {
  ListNode,
  ListItemNode
} from '@lexical/list';
import {
  $createLinkNode,
  $isLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND
} from '@lexical/link';
import {
  Bold, Italic, Underline, List, ListOrdered, 
  Undo, Redo, Link, Code, Quote,
  Type, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Image as ImageIcon,
  Strikethrough, Superscript, Subscript, Palette,
  Eraser, ExternalLink
} from 'lucide-react';
import { uploadImage } from '../config/firebase';

// Image Node for Lexical
class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(src, altText, maxWidth, width, height, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width;
    this.__height = height;
  }

  createDOM() {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    return span;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  setWidthAndHeight(width, height) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  decorate() {
    return (
      <div
        style={{
          display: 'block',
          margin: '10px 0',
          textAlign: 'left'
        }}
      >
        <img
          src={this.__src}
          alt={this.__altText}
          style={{
            maxWidth: this.__maxWidth || '100%',
            width: this.__width || 'auto',
            height: this.__height || 'auto',
            borderRadius: '8px',
            display: 'block',
            border: '1px solid #444'
          }}
          draggable={false}
          onError={(e) => {
            console.error('Image failed to load in editor:', e.target.src);
            e.target.style.border = '2px solid red';
            e.target.alt = 'Failed to load image';
          }}
        />
      </div>
    );
  }

  static importJSON(serializedNode) {
    const { src, altText, maxWidth, width, height } = serializedNode;
    const node = $createImageNode({
      src,
      altText,
      maxWidth,
      width,
      height,
    });
    return node;
  }

  exportJSON() {
    return {
      type: 'image',
      src: this.getSrc(),
      altText: this.getAltText(),
      maxWidth: this.__maxWidth,
      width: this.__width,
      height: this.__height,
      version: 1,
    };
  }

  exportDOM() {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('style', `max-width: ${this.__maxWidth || '100%'}; border-radius: 8px; margin: 10px 0; display: block;`);
    if (this.__width) element.setAttribute('width', this.__width);
    if (this.__height) element.setAttribute('height', this.__height);
    return { element };
  }

  static importDOM() {
    return {
      img: (node) => ({
        conversion: (domNode) => {
          const { src, alt, width, height } = domNode;
          const node = $createImageNode({
            src,
            altText: alt,
            width,
            height,
            maxWidth: '100%'
          });
          return { node };
        },
        priority: 0,
      }),
    };
  }
}

export function $createImageNode({ src, altText, maxWidth, width, height }) {
  return new ImageNode(src, altText, maxWidth, width, height);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsCode(selection.hasFormat('code'));
      
      // Check if we're in a link
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach(node => {
          const parent = node.getParent();
          if (parent) {
            if (headingSize === 'p') {
              const paragraph = $createParagraphNode();
              parent.replace(paragraph);
              paragraph.append(...parent.getChildren());
            } else {
              const heading = $createHeadingNode(headingSize);
              parent.replace(heading);
              heading.append(...parent.getChildren());
            }
          }
        });
      }
    });
  };

  const insertList = (listType) => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const insertLink = () => {
    const url = prompt('URL girin:');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach(node => {
          const parent = node.getParent();
          if (parent) {
            const quote = new QuoteNode();
            parent.replace(quote);
            quote.append(...parent.getChildren());
          }
        });
      }
    });
  };

  const clearFormatting = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.formatText('bold', false);
      selection.formatText('italic', false);
      selection.formatText('underline', false);
      selection.formatText('strikethrough', false);
      selection.formatText('superscript', false);
      selection.formatText('subscript', false);
      selection.formatText('code', false);
    }
  };

  const applyTextColor = (color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        if (selectedText) {
          // Remove selected text
          selection.removeText();
          // Insert HTML with color styling
          const parser = new DOMParser();
          const dom = parser.parseFromString(
            `<span style="color: ${color}">${selectedText}</span>`,
            'text/html'
          );
          const nodes = $generateNodesFromDOM(editor, dom);
          $insertNodes(nodes);
        } else {
          // If no text selected, show message
          alert('Lütfen renk uygulamak için önce metin seçin.');
        }
      }
    });
    setShowColorPicker(false);
  };

  const applyBackgroundColor = (color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        if (selectedText) {
          // Remove selected text
          selection.removeText();
          // Insert HTML with background color styling
          const parser = new DOMParser();
          const dom = parser.parseFromString(
            `<span style="background-color: ${color}; padding: 2px 4px; border-radius: 2px;">${selectedText}</span>`,
            'text/html'
          );
          const nodes = $generateNodesFromDOM(editor, dom);
          $insertNodes(nodes);
        } else {
          // If no text selected, show message
          alert('Lütfen arka plan rengi uygulamak için önce metin seçin.');
        }
      }
    });
    setShowBgColorPicker(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası seçin.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    setIsUploading(true);

    try {
      const imageData = await uploadImage(file, 'article-images');
      
      editor.update(() => {
        const imageNode = $createImageNode({
          src: imageData.url,
          altText: file.name,
          maxWidth: '100%'
        });
        
        $insertNodes([imageNode]);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Resim yüklenirken bir hata oluştu: ' + error.message);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-[#333] bg-[#1a1a1a]/60">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 mr-3">
        <button
          onClick={() => formatText('bold')}
          className={`p-2 rounded-lg transition-colors ${
            isBold ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('italic')}
          className={`p-2 rounded-lg transition-colors ${
            isItalic ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('underline')}
          className={`p-2 rounded-lg transition-colors ${
            isUnderline ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('code')}
          className={`p-2 rounded-lg transition-colors ${
            isCode ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('strikethrough')}
          className={`p-2 rounded-lg transition-colors ${
            isStrikethrough ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('superscript')}
          className={`p-2 rounded-lg transition-colors ${
            isSuperscript ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Superscript"
        >
          <Superscript className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('subscript')}
          className={`p-2 rounded-lg transition-colors ${
            isSubscript ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Subscript"
        >
          <Subscript className="w-4 h-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 mr-3">
        <button
          onClick={() => formatHeading('p')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatHeading('h1')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatHeading('h2')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatHeading('h3')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 mr-3">
        <button
          onClick={() => insertList('bullet')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertList('number')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={insertQuote}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 mr-3">
        <button
          onClick={() => formatAlignment('left')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatAlignment('center')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatAlignment('right')}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Image Upload */}
      <div className="flex items-center gap-1 mr-3">
        <label className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <button
            type="button"
            disabled={isUploading}
            className={`p-2 rounded-lg transition-colors ${
              isUploading 
                ? 'text-gray-600 bg-[#333] cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-[#333]'
            }`}
            title="Resim Ekle"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </label>
      </div>

      {/* Link */}
      <div className="flex items-center gap-1 mr-3">
        <button
          onClick={insertLink}
          className={`p-2 rounded-lg transition-colors ${
            isLink ? 'bg-[#00FF1E]/20 text-[#00FF1E]' : 'text-gray-400 hover:text-white hover:bg-[#333]'
          }`}
          title="Link Ekle"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Colors */}
      <div className="flex items-center gap-1 mr-3 relative">
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-12 left-0 bg-[#1a1a1a] border border-[#333] rounded-lg p-3 z-10 shadow-lg">
              <div className="grid grid-cols-6 gap-2 mb-2">
                {['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#000000', '#808080'].map(color => (
                  <button
                    key={color}
                    onClick={() => applyTextColor(color)}
                    className="w-6 h-6 rounded border border-[#444] hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowColorPicker(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
            title="Background Color"
          >
            <div className="w-4 h-4 border-2 border-current rounded bg-yellow-400"></div>
          </button>
          {showBgColorPicker && (
            <div className="absolute top-12 left-0 bg-[#1a1a1a] border border-[#333] rounded-lg p-3 z-10 shadow-lg">
              <div className="grid grid-cols-6 gap-2 mb-2">
                {['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#ffffff', '#000000', '#808080'].map(color => (
                  <button
                    key={color}
                    onClick={() => applyBackgroundColor(color)}
                    className="w-6 h-6 rounded border border-[#444] hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowBgColorPicker(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-1 mr-3">
        <button
          onClick={clearFormatting}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Clear Formatting"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// HTML conversion plugin
function HtmlPlugin({ value, onChange }) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  // Set initial HTML content only once
  useEffect(() => {
    if (value && value.trim() !== '' && !isInitialized) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
      setIsInitialized(true);
    }
  }, [editor, value, isInitialized]);

  // Convert to HTML on change
  const handleChange = (editorState) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      if (onChange) {
        onChange(htmlString);
      }
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
}

// Main editor component
const RichTextEditor = ({ value, onChange, placeholder = "Makale içeriğinizi yazın..." }) => {
  const theme = {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
      superscript: 'align-super text-xs',
      subscript: 'align-sub text-xs',
      code: 'bg-[#262626] px-1 py-0.5 rounded text-[#00FF1E] font-mono text-sm'
    },
    heading: {
      h1: 'text-3xl font-bold text-white my-4',
      h2: 'text-2xl font-bold text-white my-3',
      h3: 'text-xl font-bold text-white my-2'
    },
    list: {
      ol: 'list-decimal list-inside my-2 pl-4',
      ul: 'list-disc list-inside my-2 pl-4',
      listitem: 'my-1'
    },
    paragraph: 'my-2 text-gray-300',
    quote: 'border-l-4 border-[#00FF1E] pl-4 my-4 italic text-gray-300 bg-[#1a1a1a]/30',
    link: 'text-[#00FF1E] underline hover:text-[#00FF1E]/80 cursor-pointer'
  };

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      ImageNode,
      LinkNode
    ],
    onError: (error) => {
      console.error('Lexical error:', error);
    },
    editorState: value && value.trim() !== '' ? undefined : null
  };

  return (
    <div className="bg-[#1a1a1a]/60 border border-[#333] rounded-2xl overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[400px] p-6 text-white focus:outline-none resize-none editor-input"
                style={{ fontSize: '16px', lineHeight: '1.6' }}
              />
            }
            placeholder={
              <div className="absolute top-6 left-6 text-gray-500 pointer-events-none editor-placeholder">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <HtmlPlugin value={value} onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default RichTextEditor;
