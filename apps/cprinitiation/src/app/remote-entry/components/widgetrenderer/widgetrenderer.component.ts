/* eslint-disable @typescript-eslint/no-explicit-any */

import { 
  AfterViewChecked, AfterViewInit, OnDestroy, Component, 
  EventEmitter, Input, OnInit, ViewChild, ViewContainerRef, 
  ViewEncapsulation, OnChanges 
} from '@angular/core';

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JsonSchemaFormComponent, JsonSchemaFormService, Schema, State } from '@mk/json-schema-form';
//import { CustomComponent } from '../custom/custom.component';
import { FormrendererDirective } from '../../formrenderer.directive';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Subscription } from 'rxjs';
//import { FieldrendererComponent } from '../fieldrenderer/fieldrenderer.component';

@Component({
  selector: 'lps-widgetrenderer',
  templateUrl: './widgetrenderer.component.html',
  styleUrl: './widgetrenderer.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class WidgetrendererComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked, ICellRendererAngularComp, OnChanges {
  
  name = 'Welcome From Entry Component ';
  @ViewChild('lazyComponent', { read: ViewContainerRef })
  lazyComponentContainer!: ViewContainerRef;
  stylesLoaded!:boolean;

  @Input() eventEmitter!: EventEmitter<string>; 
  private subscription!: Subscription;

  @Input() widget: any;

  paramsObject: any;

  @Input() widgetrendererParam!:any;

  /**
   * need to access custom component registry
   * @param service   service for registering custom widgets etc.
   * @param route     allows selecting an example via URL
   */
  constructor(public service: JsonSchemaFormService, private route: ActivatedRoute) { }

  

  @ViewChild(FormrendererDirective, { static: true }) lpsFormrendererHost!: FormrendererDirective;

  /**
   * example schema for meta schema case - also used in schema editor component
   */
  static schemaExample = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Enter your name'
      },
      age: {
        type: 'number',
        title: 'Your age',
      },
      emails: {
        type: 'array',
        items: {
          type: 'string', format: 'email'
        }
      }
    }
  };

  /**
   * meta schema for meta schema case - also used in schema editor component
   */
  static metaschema: Schema = {
    $schema: 'https://json-schema.org/draft-06/schema#',
    $ref: '#/definitions/prop',
    definitions: {
      prop: {
        type: 'object',
        hideUndefined: true,
        switch: 'type',
        class: [
          'mat-elevation-z4'
        ],
        style: {
          'font-size': 'small'
        },
        properties: {
          type: { type: 'string', enum: ['string', 'number', 'array', 'object'] },
          enum: { type: 'array', items: { type: 'string' }, case: ['string'] },
          multipleOf: { type: 'number', case: ['number'] },
          maximum: { type: 'number', case: ['number'] },
          exclusiveMaximum: { type: 'number', case: ['number'] },
          minimum: { type: 'number', case: ['number'] },
          exclusiveMinimum: { type: 'number', case: ['number'] },
          maxLength: { type: 'number', case: ['string'] },
          minLength: { type: 'number', case: ['string'] },
          pattern: { type: 'string', case: ['string'] },
          maxItems: { type: 'number', case: ['array'] },
          minItems: { type: 'number', case: ['array'] },
          uniqueItems: { type: 'boolean', case: ['array'] },
          maxProperties: { type: 'number', case: ['object'] },
          minProperties: { type: 'number', case: ['object'] },
          additionalProperties: { $ref: '#/definitions/prop' },
          required: { type: 'array', case: ['object'], items: { type: 'string' } },
          propertyNames: { type: 'string', case: ['object'] },
          title: { type: 'string' },
          description: { type: 'string' },
          default: { type: 'string' },
          examples: { type: 'array', items: { type: 'string' }, case: ['string'] },
          readOnly: { type: 'boolean', case: ['string', 'number', 'array'] },
          format: { type: 'string', case: ['string'], enum: [null, 'email', 'ipv4', 'url', 'uri'] },
          items: {
            $ref: '#/definitions/propNoRec'
          },
          properties: {
            case: ['object'],
            type: 'object',
            layout: 'vertical',
            additionalProperties: { $ref: '#/definitions/prop' }
          }
        }
      },
      propNoRec: {
        case: ['array'],

        type: 'object',
        hideUndefined: true,
        switch: 'type',
        class: [
          'mat-elevation-z4'
        ],
        style: {
          'font-size': 'small'
        },
        properties: {
          type: { type: 'string', enum: ['string', 'number', 'array', 'object'] },
          enum: { type: 'array', items: { type: 'string' }, case: ['string'] },
          multipleOf: { type: 'number', case: ['number'] },
          maximum: { type: 'number', case: ['number'] },
          exclusiveMaximum: { type: 'number', case: ['number'] },
          minimum: { type: 'number', case: ['number'] },
          exclusiveMinimum: { type: 'number', case: ['number'] },
          maxLength: { type: 'number', case: ['string'] },
          minLength: { type: 'number', case: ['string'] },
          pattern: { type: 'string', case: ['string'] },
          maxItems: { type: 'number', case: ['array'] },
          minItems: { type: 'number', case: ['array'] },
          uniqueItems: { type: 'boolean', case: ['array'] },
          maxProperties: { type: 'number', case: ['object'] },
          minProperties: { type: 'number', case: ['object'] },
          additionalProperties: { $ref: '#/definitions/prop' },
          required: { type: 'array', case: ['object'], items: { type: 'string' } },
          propertyNames: { type: 'string', case: ['object'] },
          title: { type: 'string' },
          description: { type: 'string' },
          default: { type: 'string' },
          examples: { type: 'array', items: { type: 'string' }, case: ['string'] },
          readOnly: { type: 'boolean', case: ['string', 'number', 'array'] },
          format: { type: 'string', case: ['string'], enum: [null, 'email', 'ipv4', 'url', 'uri'] },
          properties: {
            case: ['object'],
            type: 'object',
            layout: 'vertical',
            additionalProperties: { $ref: '#/definitions/prop' }
          }
        }
      },
    }
  };

  state!: State;

  /**
   * show validation result
   */
  error: string | undefined;

  /**
   * desc of the example
   */
  description = 'The simplest JSON schema form. Try clicking on the buttons to get to more complex examples.';

  /**
   * examples
   */
  examples: { [key: string]: { description: string, value: any, schema: Schema } } =
    {
      string: {
        description: 'The simplest JSON schema form. Try clicking on the buttons to get to more complex examples.',
        value: 'test',
        schema: { type: 'string' }
      },
      boolean: {
        description: 'Boolean defaults to a checkbox',
        value: true,
        schema: { type: 'boolean' }
      },
      integer: {
        description: 'Integer uses a textfield and rounds floating point numbers entered.',
        value: 5,
        schema: { type: 'integer' }
      },
      number: {
        description: 'Number allows entering any type of integer or floating point',
        value: 3.14,
        schema: { type: 'number' }
      },
      array: {
        description: 'Arrays display + and - controls',
        value: ['a', 'b'],
        schema: { type: 'array', items: { type: 'string' } }
      },
      object: {
        description: 'Object displays a key / value form',
        value: { name: 'Angular', version: 9 },
        schema: { type: 'object', properties: { name: { type: 'string' }, version: { type: 'number' } } }
      },
      select: {
        description: 'The select widget exchanges the input field for a select combo box',
        value: 'France',
        schema: {
          type: 'string',
          widget: 'select',
          choicesUrl: '/assets/autocomplete-simple.json',
          choicesVerb: 'GET'
        }
      },
      radio: {
        description: 'The radio widget exchanges the input field for a select combo box',
        value: 'France',
        schema: {
          type: 'string',
          widget: 'radio',
          choicesUrl: '/assets/autocomplete-simple.json',
          choicesVerb: 'GET'
        }
      },
      upload: {
        description: 'The file contents is written into the string (if type is array it is parsed, if type is object it is parsed if possible - the result is an object with data and file metadata)',
        value: '',
        schema: {
          type: 'string',
          widget: 'upload'
        }
      },
      upload64: {
        description: 'The file contents is base64 encoded and written into the string',
        value: '',
        schema: {
          type: 'string',
          widget: 'upload64'
        }
      },
      date: {
        description: 'Entering dates using the material date picker',
        value: {
          ISO8601: '2020-10-14T00:00:00.000Z',
          formatted: '12/31/2020',
          millisecs: 0
        },
        schema: {
          type: 'object',
          properties: {
            ISO8601: {
              type: 'string',
              widget: 'date'
            },
            formatted: {
              type: 'string',
              widget: 'date',
              dateFormat: 'MM/dd/yyyy'
            },
            millisecs: {
              type: 'integer',
              widget: 'date'
            }
          }
        }
      },
      textarea: {
        description: 'Textarea allows multi-line inputs. Note that the style key controls the input size',
        value: 'multi\nline\ntext',
        schema: {
          type: 'string',
          widget: 'textarea',
          style: { width: '600px', height: '300px', 'font-family': 'courier' }
        }
      },
      password: {
        description: 'Password entry - hidden on the UI',
        value: 'secret',
        schema: {
          type: 'string',
          widget: 'password'
        }
      },
      color: {
        description: 'Color picker generates hex color codes',
        value: '',
        schema: {
          type: 'string',
          widget: 'color'
        }
      },
      'datetime-local': {
        description: 'Browser input type (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)',
        value: '',
        schema: {
          type: 'string',
          widget: 'datetime-local'
        }
      },
      email: {
        description: 'Browser input type (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)',
        value: '',
        schema: {
          type: 'string',
          widget: 'email'
        }
      },
      month: {
        description: 'Browser input type (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)',
        value: '',
        schema: {
          type: 'string',
          widget: 'month'
        }
      },
      tel: {
        description: 'Browser input type (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)',
        value: '',
        schema: {
          type: 'string',
          widget: 'tel'
        }
      },
      time: {
        description: 'Browser input type (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)',
        value: '',
        schema: {
          type: 'string',
          widget: 'time'
        }
      },
      url: {
        description: 'Browser input type (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)',
        value: '',
        schema: {
          type: 'string',
          widget: 'url'
        }
      },
      week: {
        description: 'Browser input type (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)',
        value: '',
        schema: {
          type: 'string',
          widget: 'week'
        }
      },
      custom: {
        description: 'JSON schema form can be extended by providing custom widgets. This example provides a rich text editor based on the ngx-editor component.',
        value: '<b>test</b>',
        schema: {
          type: 'string',
          widget: 'custom',
          widgetType: 'rich-text-editor'
        }
      },
      enum: {
        description: 'JSON schema enums defaults to a select combo box',
        value: null,
        schema: { type: 'string', enum: [null, 'true', 'false'] }
      },
      required: {
        description: 'Required fields warn the user if they are left blank',
        value: {},
        schema: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' }
          }
        }
      },
      title: {
        description: 'JSON schema titles show up in the input field',
        value: null,
        schema: { type: 'string', title: 'My title' }
      },
      description: {
        description: 'JSON schema description translates to tool tips',
        value: null,
        schema: { type: 'string', description: 'You find me in the tooltip' }
      },
      default: {
        description: 'JSON schema default values make sure null and undefined values are set',
        value: undefined,
        schema: { type: 'string', default: 'default value' }
      },
      examples: {
        description: 'JSON schema examples show up as a placeholder',
        value: null,
        schema: { type: 'string', examples: ['A possible entry'] }
      },
      readOnly: {
        description: 'JSON schema read only causes the input element to be disabled',
        value: 'readOnly value',
        schema: { type: 'string', readOnly: true }
      },
      additionalProperties: {
        description: 'JSON schema additional properties allow arbitrary key / value objects to be edited',
        value: { url: 'https://example.org', args: { limit: 10 } },
        schema: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            args: {
              type: 'object',
              layout: 'vertical',
              additionalProperties: { type: 'string' }
            }
          }
        }
      },
      ref: {
        description: 'JSON schema ref allows for definitions to be reused. Here we reuse the address to enter both work and home address.',
        value: null,
        schema: {
          definitions: {
            address: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                zip: { type: 'number' },
              }
            }
          },
          type: 'object',
          properties: {
            home: { $ref: '#/definitions/address' },
            work: { $ref: '#/definitions/address' }
          }
        }
      },
      refUrl: {
        description: `JSON schema $ref is loaded from a URL`,
        value: null,
        schema: { $ref: 'https://raw.githubusercontent.com/riskine/ontology/master/schemas/core/profession.json' }
      },
      refLocal: {
        description: `JSON schema $ref is loaded via the referenced field in the root schema.
          It is up to the application to load the referenced schemas and place them in the map.
          Note that the map key is the schema $id`,
        value: null,
        schema: {
          $ref: 'https://www.dashjoin.org/#/concept',
          referenced: {
            'https://www.dashjoin.org/': {
              $id: 'https://www.dashjoin.org/',
              concept: {
                type: 'object',
                properties: {
                  a: { $ref: 'string.json' },
                  b: { $ref: 'string.json' }
                }
              }
            },
            'https://www.dashjoin.org/string.json': {
              $id: 'https://www.dashjoin.org/string.json',
              type: 'string'
            }
          }
        }
      },
      pattern: {
        description: 'JSON schema pattern allows specifying a pattern that must match the input (^ matches the beginning, $ the end)',
        value: 'abcd3456',
        schema: {
          type: 'string',
          pattern: '^[a-z]+$'
        }
      },
      maxLength: {
        description: 'JSON schema maxLength (minLength) allows specifying that a string must be at most (least) x characters long',
        value: 'CA',
        schema: {
          type: 'string',
          maxLength: 2
        }
      },
      format: {
        description: 'JSON schema format work like built-in patterns (email, ipv4, uri, url)',
        value: 'john@example.org',
        schema: {
          type: 'string',
          format: 'email'
        }
      },
      multipleOf: {
        description: 'JSON schema multipleOf requires the input to be a multiple of x',
        value: 88,
        schema: {
          type: 'number',
          multipleOf: 11
        }
      },
      maximum: {
        description: `JSON schema maximum requires the input to be less
          than x (exclusiveMaximum, minimum and exclusiveMinimum work accordingly)`,
        value: 4,
        schema: {
          type: 'number',
          maximum: 10
        }
      },
      maxItems: {
        description: `JSON schema maxItems (minItems) restricts array length`,
        value: [1],
        schema: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 3,
        }
      },
      uniqueItems: {
        description: `JSON schema uniqueItems states that every array element must be unique`,
        value: [1, 2, 2, 3],
        schema: {
          type: 'array',
          items: { type: 'number' },
          uniqueItems: true,
        }
      },
      maxProperties: {
        description: `JSON schema maxProperties (minProperties) restricts the number of fields`,
        value: { key: 'value' },
        schema: {
          type: 'object',
          additionalProperties: { type: 'string' },
          minProperties: 2,
          maxProperties: 3,
        }
      },
      propertyNames: {
        description: `JSON schema propertyNames requires field names to match this regular expression`,
        value: { key: 'value' },
        schema: {
          type: 'object',
          additionalProperties: { type: 'string' },
          propertyNames: '^[a-z]+$'
        }
      },
      dependencies: {
        description: `JSON schema dependencies defines which properties depend on other properties being present`,
        value: { credit_card: 5555555555555555 },
        schema: {
          type: 'object',
          properties: {
            credit_card: { type: 'number' },
            billing_address: { type: 'string' }
          },
          dependencies: { credit_card: ['billing_address'] }
        }
      },
      compute: {
        description: 'Allows to compute fields based on JSONata expressions (https://jsonata.org/)',
        value: null,
        schema: {
          type: 'object',
          properties: { first: { type: 'string' }, last: { type: 'string' }, salutation: { type: 'string', readOnly: true } },
          computed: {
            salutation: '"Dear " & first & " " & last & ", " & $context("var")'
          }
        }
      },
      errorMessage: {
        description: 'Allows customizing the validation error message',
        value: '1234',
        schema: {
          type: 'string', widget: 'password', errorMessage: 'Your password must have at least 6 characters', minLength: 6
        }
      },
      createOnly: {
        description: 'Like readOnly, but allows changing values if the original value is null / undefined',
        value: { createOnly: null, exists: 'Existing data cannot be changed' },
        schema: {
          type: 'object', properties: {
            createOnly: { type: 'string', createOnly: true },
            exists: { type: 'string', createOnly: true, style: { width: '300px' } },
          }
        }
      },
      simpleGet: {
        description: 'Getting autocomplete options from a REST service',
        value: null,
        schema: {
          type: 'string',
          choicesUrl: '/assets/autocomplete-simple.json',
          choicesVerb: 'GET'
        }
      },
      jsonPointer: {
        description: 'Getting autocomplete options from a REST service and processing the result via JSONata',
        value: null,
        schema: {
          type: 'string',
          choicesUrl: '/assets/autocomplete-complex.json',
          jsonata: 'result.name',
          choicesVerb: 'GET'
        }
      },
      jsonata: {
        description: 'Getting autocomplete options (name and value) from a REST service and processing the result via JSONata',
        value: null,
        schema: {
          type: 'string',
          choicesUrl: '/assets/autocomplete-complex.json',
          jsonata: 'result.{"name": name, "value": url}',
          choicesVerb: 'GET'
        }
      },
      'static-choices': {
        description: 'Static options for autocomplete',
        value: null,
        schema: {
          type: 'string',
          choices: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
        }
      },
      displayWith: {
        description: 'Select and autocomplete allow associating display names to value options',
        value: {
          select: 'WA',
          autocomplete: 'https://en.wikipedia.org/wiki/Indonesia'
        },
        schema: {
          type: 'object',
          properties: {
            autocomplete: {
              type: 'string',
              displayWith: 'localName',
              choices: ['https://en.wikipedia.org/wiki/Indonesia', 'https://en.wikipedia.org/wiki/Peru', 'As is - no tooltip']
            },
            select: {
              type: 'string',
              widget: 'select',
              displayWith: 'states',
              choices: ['CA', 'OR', 'WA']
            }
          }
        }
      },
      displayWithChoices: {
        description: 'Select with fixed value and display options',
        value: 'WA',
        schema: {
          type: 'string',
          widget: 'select',
          displayWithChoices: ['California', 'Orgeon', 'Washington'],
          choices: ['CA', 'OR', 'WA']
        }
      },
      typeAhead: {
        description: 'Custom ChoiceHandler allows implementing typeahead functionality',
        value: null,
        schema: {
          type: 'string',
          displayWith: 'typeAhead'
        }
      },
      order: {
        description: 'Define order, omission, and hierarchy of object fields',
        value: {
          name: 'Joe',
          hidden: 'not in form',
          age: 22,
          emails: ['joe@example.org', 'joe@gmail.com'],
          address: { city: 'LA' }
        },
        schema: {
          type: 'object',
          layout: 'vertical',
          order: [
            [
              'name',
              'age'
            ],
            'emails',
            'address'
          ],
          properties: {
            emails: {
              class: [
                'mat-elevation-z0'
              ],
              type: 'array',
              items: {
                type: 'string'
              }
            },
            name: {
              type: 'string'
            },
            hidden: {
              type: 'string'
            },
            age: {
              type: 'number'
            },
            address: {
              type: 'object',
              properties: {
                city: {
                  type: 'string'
                },
                zip: {
                  type: 'integer'
                }
              }
            }
          }
        }
      },
      tab: {
        description: 'Tab layout for arrays and objects with arbitrary key / value pairs',
        value: [{ name: 'Angular', version: 9 }, { name: 'Vue' }],
        schema: {
          type: 'array', layout: 'tab',
          items: { type: 'object', properties: { name: { type: 'string' }, version: { type: 'number' } } }
        }
      },
      table: {
        description: 'Table layout for arrays of objects',
        value: [{ name: 'Angular', version: 9 }, { name: 'Vue' }],
        schema: {
          type: 'array', layout: 'table',
          items: { type: 'object', properties: { name: { type: 'string' }, version: { type: 'number' } } }
        }
      },
      vertical: {
        description: 'Vertical flex layout of input elements',
        value: [{ name: 'Angular', version: 9 }, { name: 'Vue' }],
        schema: {
          type: 'array', layout: 'vertical',
          items: { type: 'object', properties: { name: { type: 'string' }, version: { type: 'number' } } }
        }
      },
      horizontal: {
        description: 'Horizontal flex layout of input elements',
        value: [{ name: 'Angular', version: 9 }, { name: 'Vue' }],
        schema: {
          type: 'array', layout: 'horizontal',
          items: { type: 'object', properties: { name: { type: 'string' }, version: { type: 'number' } } }
        }
      },
      nested: {
        description: 'Example showing that layouts can also be nested on different levels',
        value: [{ name: 'Angular', version: 9 }, { name: 'Vue' }],
        schema: {
          type: 'array', layout: 'horizontal',
          items: { type: 'object', layout: 'vertical', properties: { name: { type: 'string' }, version: { type: 'number' } } }
        }
      },
      'array-select': {
        description: 'Allows arrays to be assembled from options',
        value: ['India', 'China'],
        schema: {
          type: 'array', 
          layout: 'select',
          choicesUrl: '/assets/autocomplete-simple.json',
          choicesVerb: 'GET',
          items: { type: 'string' }
        }
      },
      checkbox: {
        description: 'Allows arrays to be assembled from options',
        value: [ 'China', 'India'],
        schema: {
          type: 'array', 
          layout: 'checkbox',
          choicesUrl: '/assets/loanType.json',
          choicesVerb: 'GET',
          items: { type: 'string' }
        }
      },
      chips: {
        description: 'Chips style editing of string arrays',
        value: ['red', 'green', 'yellow'],
        schema: {
          title: 'You favorite colors',
          type: 'array', 
          layout: 'chips',
          items: { type: 'string' }
        }
      },
      conditional: {
        description: 'Allows a switch field to determine which other fields are visible. For instance, cicles show radius but not height',
        value: { type: 'circle' },
        schema: {
          type: 'object',
          switch: 'type',
          properties: {
            type: { type: 'string', enum: ['circle', 'rect', 'square'] },
            color: { type: 'string', widget: 'color' },
            radius: { type: 'number', case: ['circle'] },
            width: { type: 'number', case: ['rect', 'square'] },
            height: { type: 'number', case: ['rect'] },
          }
        }
      },
      style: {
        description: 'Shows how css styles can be passed to form elements',
        value: 'style me!',
        schema: {
          type: 'string',
          style: {
            'font-size': '44px',
            'font-family': 'courier',
            width: '80%',
            'background-color': 'lightgrey',
            color: 'blue',
            padding: '50px'
          }
        }
      },
      class: {
        description: 'Shows how css classes can be passed to the form elements',
        value: ['a', 'b'],
        schema: {
          type: 'array',
          class: [
            'mat-elevation-z16'
          ],
          items: {
            type: 'string'
          }
        }
      },
      expanded: {
        description: 'If expanded is present, the component is put in an expansion panel. The value indicates if the panel is open or not',
        value: [{ name: 'Angular' }, {}],
        schema: {
          type: 'array',
          layout: 'vertical',
          title: 'Software',
          items: {
            expanded: false,
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              version: {
                type: 'number'
              }
            }
          }
        }
      },
      hideUndefined: {
        description: 'For object layouts, hides the input elements for undefined properties',
        value: { p1: 'x' },
        schema: {
          type: 'object',
          hideUndefined: true,
          properties: {
            p1: { type: 'string' },
            p2: { type: 'string' },
            p3: { type: 'array', items: { type: 'string' } },
            p4: { type: 'object', properties: { x: { type: 'string' } } }
          }
        }
      },
      complex: {
        description: 'A complex example combining multiple features',
        value: [
          {
            name: 'joe',
            country: 'United States',
            email: ['joe@example.org', 'alt@example.org'],
            birthday: '2000-03-22T23:00:00.000Z',
            consent: 'yes'
          },
          {
            name: 'mike'
          }
        ],
        schema: {
          type: 'array',
          title: 'Person',
          items: {
            type: 'object',
            layout: 'vertical',
            required: ['consent'],
            properties: {
              name: { type: 'string' },
              country: {
                description: 'Options loaded via REST',
                type: 'string',
                widget: 'select',
                choicesUrl: '/assets/autocomplete-simple.json',
                choicesVerb: 'GET'
              },
              password: {
                type: 'string',
                widget: 'password'
              },
              birthday: {
                type: 'string',
                widget: 'date'
              },
              email: {
                type: 'array',
                layout: 'vertical',
                items: { type: 'string', format: 'email', errorMessage: 'Please enter a valid email' }
              },
              consent: {
                title: 'I consent',
                description: 'This is a required field',
                type: 'string',
                enum: [null, 'yes', 'no']
              },
            }
          }
        }
      },
      metaschema: {
        description: 'This schema allows editing JSON schema itself. Note that not all JSON schema features are supported.',
        value: WidgetrendererComponent.schemaExample,
        schema: WidgetrendererComponent.metaschema
      }
  };

  /**
   * error string in case the user enters invalid JSON in the schema text area
   */
  errorS: any;

  /**
   * error string in case the user enters invalid JSON in the value text area
   */
  errorV: any;

  showView = false;

  ngOnInit(): void {

    //this.service.registerComponent('rich-text-editor', CustomComponent);
    // this.select('string')

    // this.route.params.subscribe(res => {
    //   if ((res as any).id) {
    //     this.select((res as any).id);
    //   }
    // })

    
    this.set(this.widgetrendererParam.schema, this.widgetrendererParam.value, this.widgetrendererParam.name, this.widgetrendererParam.groupTitle);

    this.subscribeToParentEmitter();
    
  }

    /**
   * select one of the examples
   */
    select(key: string) {
      this.description = this.examples[key].description;
      this.error = '';
      this.set(this.examples[key].schema, this.examples[key].value, "test")
    }
  
    /**
     * select one of the examples
     */
    set(schema: any, value: any, name:string, groupTitle?:string) {
      this.lpsFormrendererHost.viewContainerRef.clear()
      const add = this.lpsFormrendererHost.viewContainerRef.createComponent(JsonSchemaFormComponent)
      let control
      if (schema.type === 'array' && schema.layout !== 'select' && schema.layout !== 'chips')
        control = new FormArray([])
      else if (schema.type === 'object')
        control = new FormGroup({})
      else
        control = new FormControl()
  
      this.state = {
        schema,
        value,
        name: name,
        control,
        groupTitle: groupTitle
      }
      add.instance.state = this.state
  
      this.state.control.valueChanges.subscribe(res => {
        setTimeout(() => {
          // this triggers a re-render, protect against ExpressionChangedAfterItHasBeenCheckedError
          this.state.value = res
        })
        console.log(res);
      })
      this.state.control.statusChanges.subscribe(res => {
        setTimeout(() => {
          // this triggers a re-render, protect against ExpressionChangedAfterItHasBeenCheckedError
          if (res === 'VALID' || res === 'DISABLED')
            this.error = undefined
          else
            this.error = res
        })
        console.log(res);
      })
    }
  
    /**
     * stringify JSON for display in the textarea
     */
    stringify(o: any): string {
      return JSON.stringify(o, null, 2);
    }
  
    /**
     * user made change in schema textarea:
     * set schema and handle parse error
     */
    changeS(event: any): void {
      try {
        this.set(JSON.parse(event.target.value), this.state.value, "test")
        this.errorS = null;
      } catch (e) {
        this.errorS = e;
      }
    }
  
    /**
     * user made change in value textarea:
     * set schema and handle parse error
     */
    changeV(event: any): void {
      try {
        this.set(this.state.schema, JSON.parse(event.target.value), "test");
        this.errorV = null;
      } catch (e) {
        this.errorV = e;
      }
    }

  ngAfterViewInit(): void {
    // $(this.footer?.nativeElement).on('click', ()=>{
    //   alert("Welcome to Footer !");
    // })
    this.showView = true;
    console.log();
  }

  ngAfterViewChecked() {
    this.stylesLoaded = true;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }

  agInit(params: ICellRendererParams<any, any, any>): void {

    if(!Object.prototype.hasOwnProperty.call(params.data, 'groupTitle')){
      params.data.groupTitle = "Test Field";
    }

    if(!Object.prototype.hasOwnProperty.call(params.data, 'name')){
      params.data.groupTitle = "TestField";
    }

    if(!(Object.prototype.hasOwnProperty.call(params.data, 'schema') )
    || !(Object.prototype.hasOwnProperty.call(params.data, 'name'))){
      params.data.groupTitle = "Test Field";
      params.data.groupTitle = "TestField";
      params.data.schema = {
        "type": "string"
      }
      params.data.value = "test";
    }

    this.widgetrendererParam = params.data;     
   
  }

  subscribeToParentEmitter(): void { 
    this.subscription = this.eventEmitter.subscribe((data: string) => { 
      
      const parsedData = JSON.parse(data);
      
      // const schemaData: Schema = {
      //   type: parsedData.schema.type
      // }

      // const schemaData: Schema = {
      //   choicesUrl:"/assets/autocomplete-simple.json",
      //   choicesVerb:"GET",
      //   type:"string",
      //   widget:"select"
      // }

      //const value = parsedData.value; 
      //const value = 3.14;

      this.set(parsedData.schema, parsedData.value, parsedData.name, parsedData.groupTitle );
      
      //alert(data);
      //this.message = data; 

    });

  }

  ngOnDestroy(): void { 
    this.subscription.unsubscribe(); 
  }

  ngOnChanges(changes: any) {

    if (changes['eventEmitter'] && changes['eventEmitter']?.previousValue != changes['eventEmitter']?.currentValue) {
      alert("from Chiled: " + this.eventEmitter);
      //this.buttonToggle= !this.buttonToggle;
      // Do Something triggered by the parent button.
    }
  }


}


